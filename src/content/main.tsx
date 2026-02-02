import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n.ts';

import App from './App.tsx';

const root = document.createElement('div');
root.id = 'crx-root';

document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
