/// <reference types="vitest" />
import { resolve } from 'path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './manifest.config';
import packageExtensions from './vite-plugin-package-extensions';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [react(), crx({ manifest }), packageExtensions()],
  test: {
    include: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    testTimeout: 60_000,
  },
});
