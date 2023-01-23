import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import styles from './index.css?inline';

const root = document.createElement('div');
root.id = 'crx-root';

document.body.append(root);

createRoot(document.getElementById('crx-root') as Element).render(
  <StrictMode>
    <style type="text/css">{styles}</style>
    <App />
  </StrictMode>
);
