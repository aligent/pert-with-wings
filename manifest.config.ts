import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';
const { version } = packageJson;

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: 'PERT With Wings',
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
  icons: {
    '16': 'icon16.png',
    '32': 'icon32.png',
    '48': 'icon48.png',
    '128': 'icon128.png',
  },
}));
