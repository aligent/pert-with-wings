import { PluginOption } from 'vite';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import getUuid from 'uuid-by-string';
import childProcess from 'node:child_process';
import packageJson from './package.json';
import gherSay from 'ghersay';

export default function packageExtensions(): PluginOption {
  const inDir = 'dist';
  const outDir = 'extensions';
  const baseBranch = 'production';
  const { version } = packageJson;

  function addFilesToZipArchive(zip: JSZip | null, inDir: string) {
    const listOfFiles = fs.readdirSync(inDir);

    listOfFiles.forEach((fileName) => {
      const filePath = path.join(inDir, fileName);
      const file = fs.statSync(filePath);

      if (file?.isDirectory()) {
        const dir = zip!.folder(fileName);
        addFilesToZipArchive(dir, filePath);
      } else {
        // JSZip expects ArrayBuffer | Uint8Array for binary data. Convert Node Buffer to ArrayBuffer.
        const buf = fs.readFileSync(filePath);
        // Ensure we pass a plain ArrayBuffer (not SharedArrayBuffer) to satisfy JSZip typings.
        const copy = new Uint8Array(buf); // creates a Uint8Array backed by a real ArrayBuffer
        const arrayBuffer = copy.buffer;
        zip!.file(fileName, arrayBuffer);
      }
    });
  }

  function createZipArchive(zip: JSZip, outFileName: string) {
    zip
      .generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      })
      .then((file) => {
        const fileName = path.join(outDir, outFileName);

        if (fs.existsSync(fileName)) {
          fs.unlinkSync(fileName);
        }

        // `file` is a Node Buffer (Uint8Array compatible). Cast to the type expected by fs.writeFileSync.
        fs.writeFileSync(fileName, file as unknown as Uint8Array);
      });
  }

  function modifyManifest(inDir: string) {
    const data = fs.readFileSync(path.join(inDir, 'manifest.json'), {
      encoding: 'utf-8',
    });

    const jsonData = JSON.parse(data);
    // having use_dynamic_url prevents extension being installed in firefox since its an invalid value there
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1713196
    delete jsonData['web_accessible_resources'][0]['use_dynamic_url'];

    const bgData = jsonData['background'];

    jsonData['background'] = {
      scripts: [bgData['service_worker']],
      type: 'module',
    };

    // All Manifest V3 extensions need an add-on ID in their manifest.json when submitted to AMO.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#description
    jsonData.browser_specific_settings = {
      gecko: {
        id: `{${getUuid('pert-with-wings')}}`,
        strict_min_version: '58.0',
      },
    };

    fs.writeFileSync(
      path.join(inDir, 'manifest.json'),
      JSON.stringify(jsonData, null, 2),
      { encoding: 'utf-8' },
    );

    return data;
  }

  return {
    name: 'vite-plugin-package-extensions',
    apply: 'build',
    closeBundle() {
      try {
        gherSay(`Let's build v${version}`);
        console.log(
          '  %s \x1b[42m\x1b[30m\x1B[1m %s \x1b[0m\x1b[32m\x1B[1m %s \x1b[0m%s',
          '🧩',
          'PERT WITH WINGS',
          `v${version}`,
          `started packaging extensions:`,
        );
        console.log(' ');

        if (fs.existsSync(inDir)) {
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
          }
          const chromeZip = new JSZip();

          console.log('  - Preparing files for Chrome extension.');
          addFilesToZipArchive(chromeZip, inDir);

          console.log('  - Creating Chrome extension package.');
          createZipArchive(
            chromeZip,
            `chrome-PERT-with-wings-package-${version}.zip`,
          );

          console.log(
            '\x1b[32m\x1B[1m%s\x1b[0m',
            '  ✓ Chrome extension packaged.',
          );

          const firefoxZip = new JSZip();

          console.log('  - Preparing files for Firefox extension.');
          const originalManifestData = modifyManifest(inDir);
          addFilesToZipArchive(firefoxZip, inDir);

          console.log('  - Creating Firefox extension package.');
          createZipArchive(
            firefoxZip,
            `firefox-PERT-with-wings-package-${version}.zip`,
          );
          console.log(
            '\x1b[32m\x1B[1m%s\x1b[0m',
            '  ✓ Firefox extension packaged.',
          );

          console.log('  - Creating source code zip file.');
          const gitArchive = childProcess.exec(
            `git archive --format zip --output extensions/pert-extension-source-code-${version}.zip ${baseBranch}`,
          );

          // Listen for the child process to exit. Using the child process 'close' event is
          // simpler and avoids accessing stdout which can be null in some environments.
          gitArchive.on('close', () => {
            console.log(
              '\x1b[32m\x1B[1m%s\x1b[0m',
              '  \u2713 Source code zip file created.',
            );
            console.log(' ');

            console.log(
              '\x1b[36m%s\x1b[0m',
              '  Packages successfully created in /extensions',
            );

            console.log(' ');

            console.log('  - Reverting manifest to original.');

            fs.writeFileSync(
              path.join(inDir, 'manifest.json'),
              originalManifestData,
              { encoding: 'utf-8' },
            );

            console.log(
              '\x1b[32m\x1B[1m%s\x1b[0m',
              '  \u2713 Reverted manifest to original.',
            );

            console.log(' ');
            console.log(' ');
          });
        } else {
          console.log(
            '\x1b[31m%s\x1b[0m',
            `  × "${inDir}" folder does not exist!`,
          );
        }
      } catch (error) {
        console.log(
          '\x1b[31m%s\x1b[0m',
          '  × Something went wrong while building packages!',
        );
      }
    },
  };
}
