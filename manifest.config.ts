import { defineManifest } from '@crxjs/vite-plugin';

import packageJson from './package.json';
import { isFirefox } from './vite-utils';
const { version } = packageJson;

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: `PERT With Wings${env.mode === 'development' ? ' - Dev Build' : ''}`,
  description: 'Helper to make PERT estimates in JIRA / Azure DevOps tickets',
  version,
  action: {},
  content_scripts: [
    {
      run_at: 'document_end',
      js: ['src/content.tsx'],
      matches: [
        'https://dev.azure.com/*', // AzureDevOps
        'https://*.atlassian.net/*', // JIRA tickets
        'https://*/browse/*', // JIRA tickets
      ],
    },
  ],
  background: isFirefox()
    ? {
        scripts: ['src/background/service-worker.ts'],
        type: 'module',
      }
    : {
        service_worker: 'src/background/service-worker.ts',
        type: 'module',
      },
  permissions: ['storage'],
  icons: {
    '16': 'icon16.png',
    '32': 'icon32.png',
    '48': 'icon48.png',
    '128': 'icon128.png',
  },
}));
