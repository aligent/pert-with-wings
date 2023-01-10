import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

let mounted = false;

const IS_AZURE = window.location.hostname.includes('azure.com');
const IS_JIRA = window.location.hostname.includes('atlassian.net');

//document.querySelector('[data-test-id="issue.activity.comment"]')!.append(root)

// identify an element to observe
let elementToObserve =
  document.querySelector('[data-test-id="issue.activity.comment"]')! ||
  document.querySelector('[aria-label="Discussion"]')!;

// create a new instance of `MutationObserver` named `observer`,
// passing it a callback function
const observer = new MutationObserver(() => {
  let buttonContainer = elementToObserve;

  if (IS_JIRA) {
    const commentToolbar = elementToObserve.querySelector(
      '[data-testid="ak-editor-main-toolbar"]'
    );
    if (commentToolbar) {
      buttonContainer = commentToolbar;
    }
  }

  if (IS_AZURE) {
    buttonContainer = elementToObserve.parentElement!;
  }
  // const buttonContainer =
  //   IS_JIRA ?  ||
  //   (elementToObserve.nextSibling as HTMLElement)?.querySelector(
  //     ".ms-CommandBar-primaryCommands"
  //   );
  // console.log(elementToObserve, mounted);

  if (mounted && !buttonContainer) {
    mounted = false;
  }

  if (!buttonContainer || mounted) return;

  console.log('PERT: Adding PERT button to toolbar');

  const root = document.createElement('div');
  root.id = 'crx-root';
  if (IS_AZURE) {
    root.style.position = 'absolute';
    root.style.top = '5px';
    root.style.right = '5px';
  }
  buttonContainer.append(root);

  ReactDOM.createRoot(document.getElementById('crx-root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  mounted = true;
});

// call `observe()` on that MutationObserver instance,
// passing it the element to observe, and the options object

const t = setInterval(() => {
  console.log('PERT: Looking PERT button container');
  elementToObserve =
    document.querySelector('[data-test-id="issue.activity.comment"]')! ||
    document.querySelector('[aria-label="Discussion"]')!;
  if (!elementToObserve) return;

  console.log('PERT: Found PERT button container');
  observer.observe(elementToObserve, {
    subtree: true,
    childList: true,
    attributes: true,
  });
  clearInterval(t);
}, 100);
