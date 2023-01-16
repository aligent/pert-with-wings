import { useContext, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactModal from 'react-modal';

import { PertContextType } from '@/@types/pertData';
import { PertContext } from '@/context/pertContext';
import PertTable from '@/components/PertTable';
import PertRowsForm from '@/components/PertRowsForm';
import Field from '@/components/Field';
import Logo from '@/components/Logo';
import Header from '@/components/Header';

import classes from './PertModal.module.css';

const IS_JIRA = window.location.hostname.includes('atlassian.net');

const pertModalStyles = {
  overlay: {
    zIndex: 9999,
    backdropFilter: 'blur(5px)',
  },
  content: {
    maxWidth: '760px',
    margin: 'auto',
    padding: 0,
    border: 0,
    background: 'none',
    overflow: 'inherit',
  },
};

const PertModal = () => {
  const input = useRef<HTMLElement | null>(null);

  const { pertData, setIsPertModalOpen, isPertModalOpen } = useContext(
    PertContext
  ) as PertContextType;

  const getMarkup = () => {
    return renderToStaticMarkup(<PertTable pertData={pertData} />);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!input.current) return;

    const html = getMarkup();

    // clear the message box if it's just the placeholder
    if (input.current.innerHTML.includes('Add a comment\u2026')) {
      input.current.innerHTML = '';
    }

    input.current.innerHTML += html;

    setIsPertModalOpen(false);
  };

  const handleOpen = () => {
    input.current =
      (
        document.querySelector(`iframe[id^="mce_"]`) as HTMLIFrameElement
      )?.contentWindow?.document.getElementById('tinymce') || // old jira comment
      document.querySelector('[aria-label="edit-box"]') || // Azupre devops edit mode
      document.querySelector('[aria-label="Discussion"]') || // Azure devops comment
      document.querySelector('[contenteditable="true"]'); // new jira comment

    if (!input.current) {
      alert('Please click on comment box before using PERT bookmarklet.');
      return;
    }

    setIsPertModalOpen(true);
  };

  return (
    <>
      <button
        id={`pert-button-${IS_JIRA ? 'jira' : 'azure'}`}
        className={classes.openPertModalButton}
        onClick={handleOpen}
      >
        PERT
      </button>
      <ReactModal
        isOpen={isPertModalOpen}
        style={pertModalStyles}
        appElement={document.getElementById('crx-root') || undefined}
      >
        <div className={classes.content}>
          <form onSubmit={handleSubmit} action="" className={classes.pertForm}>
            <Header />
            <div className={classes.top}>
              <PertRowsForm />

              <Field
                label="Analysis, solution design and/or scoping"
                name="scoping"
              />

              <Field
                label="Automated Tests"
                name="automatedTests"
                type="checkbox"
                required={false}
              />

              <Field
                label="Complexity/Risk level"
                name="risk"
                type="select"
                values={['Low', 'Medium', 'High']}
                required={false}
              />
            </div>

            <section className={classes.pertFieldset}>
              <header className={classes.pertLegend}>Preview</header>
              <PertTable pertData={pertData} />
            </section>

            <footer className={classes.footer}>
              <button type="submit">Add PERT Estimate</button>
              <Logo />
            </footer>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default PertModal;
