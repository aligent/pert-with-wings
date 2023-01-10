import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import classnames from 'classnames';
import ReactModal from 'react-modal';

import PertTable from './PertTable';
import classes from './App.module.css';

const pertModalStyles = {
  overlay: {
    zIndex: 9999,
  },
};

function App() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    const input = document.querySelector('[aria-label="Main content area"]');
    const html = getMarkup();
    if (input) {
      // clear the message box if it's just the placeholder
      if (input.innerHTML.includes('Add a comment\u2026')) {
        input.innerHTML = '';
      }

      input.innerHTML += html;
      setIsOpen(false);
    }
  };

  const getMarkup = () => {
    return renderToStaticMarkup(<PertTable />);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClosePertModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={classes.App}>
      <button className={classes.openModalButton} onClick={handleOpen}>
        PERT
      </button>
      <ReactModal
        isOpen={isOpen}
        style={pertModalStyles}
        appElement={document.getElementById('crx-root') || undefined}
      >
        <PertTable isEditing={true} />
        <button onClick={handleOnClick}>Add comment</button>
        <button onClick={handleClosePertModal}>Cancel</button>
      </ReactModal>
    </div>
  );
}

export default App;
