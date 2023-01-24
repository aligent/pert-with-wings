import { PluginOption } from 'vite';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import getUuid from 'uuid-by-string';
import packageJson from './package.json';

export default function packageExtensions(): PluginOption {
  const inDir = 'dist';
  const outDir = 'extensions';
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
        zip!.file(fileName, fs.readFileSync(filePath));
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

        fs.writeFileSync(fileName, file);
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

    // All Manifest V3 extensions need an add-on ID in their manifest.json when submitted to AMO.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#description
    jsonData.browser_specific_settings = {
      gecko: {
        id: `{${getUuid('pert-with-wings')}}`,
        strict_min_version: '42.0',
      },
    };

    fs.writeFileSync(
      path.join(inDir, 'manifest.json'),
      JSON.stringify(jsonData, null, 2),
      { encoding: 'utf-8' }
    );
  }

  return {
    name: 'vite-plugin-package-extensions',
    apply: 'build',
    closeBundle() {
      try {
        console.log('\x1b[36m%s\x1b[0m', `Packaging extensions:`);
        if (fs.existsSync(inDir)) {
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
          }
          const chromeZip = new JSZip();

          console.log(
            '\x1b[32m%s\x1b[0m',
            '  - Preparing files for Chrome extension.'
          );
          addFilesToZipArchive(chromeZip, inDir);

          console.log(
            '\x1b[32m%s\x1b[0m',
            '  - Creating Chrome extension package.'
          );
          createZipArchive(
            chromeZip,
            `chrome-PERT-with-wings-package-${version}.zip`
          );

          console.log('\x1b[32m%s\x1b[0m', '  - Chrome extension packaged.');

          const firefoxZip = new JSZip();

          console.log(
            '\x1b[32m%s\x1b[0m',
            '  - Preparing files for Firefox extension.'
          );
          modifyManifest(inDir);
          addFilesToZipArchive(firefoxZip, inDir);

          console.log(
            '\x1b[32m%s\x1b[0m',
            '  - Creating Firefox extension package.'
          );
          createZipArchive(
            firefoxZip,
            `firefox-PERT-with-wings-package-${version}.zip`
          );
          console.log('\x1b[32m%s\x1b[0m', '  - Firefox extension packaged.');
        } else {
          console.log(
            '\x1b[31m%s\x1b[0m',
            `  - "${inDir}" folder does not exist!`
          );
        }
      } catch (error) {
        console.log(
          '\x1b[31m%s\x1b[0m',
          '  - Something went wrong while building packages!'
        );
      }
    },
  };
}
