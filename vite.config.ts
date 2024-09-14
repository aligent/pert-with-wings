/// <reference types="vitest" />
import { resolve } from 'path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './manifest.config';
import packageExtensions from './vite-plugin-package-extensions';

const isFirefox = () => {
  let browser = 'chrome';
  try {
    browser = process.argv
      .find((opts) => opts.includes('browser'))
      .split('=')[1];
  } catch (ex) {
    /** No browser supplied - defaults to chrome */
  }
  return browser === 'firefox';
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    crx({ manifest, browser: isFirefox() ? 'firefox' : 'chrome' }),
    packageExtensions(),
  ],
  test: {
    include: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    testTimeout: 60_000,
  },
});
