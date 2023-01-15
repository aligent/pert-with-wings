import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';
const { version } = packageJson;

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: 'PERT Estimator',
  description:
    'Easy to use extension to make a PERT estimate table in JIRA / Azure DevOps comments',
  version,
  action: {},
  content_scripts: [
    {
      run_at: 'document_end',
      js: ['src/content.tsx'],
      matches: [
        'http://*.atlassian.net/*',
        'https://*.atlassian.net/*',
        'https://dev.azure.com/*',
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
