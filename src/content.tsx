import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './index.css?inline';
import App from './App';

const root = document.createElement('div');
root.id = 'crx-root';

document.body.append(root);

ReactDOM.createRoot(document.getElementById('crx-root')!).render(
  <React.StrictMode>
    <style type="text/css">{styles}</style>
    <App />
  </React.StrictMode>
);
