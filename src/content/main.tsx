import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n.ts';

import App from './App.tsx';

const root = document.createElement('div');
root.id = 'crx-root';

document.body.append(root);

/**
 * Disallow closing the reply editor if there are unsaved changes
 *
 * Even though JIRA saves editor content for TOP LEVEL comments,
 * it doesn't save the content for replies.
 *
 */
window.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Escape') {
      const $target = event.target as HTMLElement;
      const isEditor =
        $target.id === 'ak-editor-textarea' ||
        $target?.closest('#ak-editor-textarea');

      if (!isEditor) return;

      const hasUnsavedChanges = $target.childNodes.length > 1;

      if (hasUnsavedChanges) {
        const confirmExit = confirm(
          'You have unsaved changes. Are you sure you want to discard them?'
        );

        if (!confirmExit) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return;
        }
      }
    }
  },
  true
);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
