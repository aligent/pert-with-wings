/// <reference types="vitest/config" />
import { resolve } from 'path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import zip from 'vite-plugin-zip-pack';

import manifest from './manifest.config';
import { isFirefox } from './vite-utils';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  plugins: [
    react(),
    crx({ manifest, browser: isFirefox() ? 'firefox' : 'chrome' }),
    zip({
      outDir: 'extensions',
      outFileName: isFirefox() ? 'release-firefox.zip' : 'release-chrome.zip'
    })
  ],
  test: {
    include: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    testTimeout: 60_000
  }
});
