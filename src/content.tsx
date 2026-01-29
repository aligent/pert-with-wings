import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';

import App from './App';
import styles from './index.css?inline';

const root = document.createElement('div');
root.id = 'crx-root';

const bottomRightContainer = document.querySelector(
  '[data-testid="layout-controller.ui.bottom-right-corner.container.styled-container"]',
);

if (bottomRightContainer) {
  bottomRightContainer.prepend(root);
} else {
  document.body.append(root);
}

createRoot(document.getElementById('crx-root') as Element).render(
  <StrictMode>
    <style type="text/css">{styles}</style>
    <App />
  </StrictMode>
);
