import { useContext, useRef } from 'react';
import { PertRowsContext } from '../context/pertRowsContext';
import { PertContextType } from '../@types/pertData';
import PertTable from './PertTable';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactModal from 'react-modal';
import PertRowsForm from './PertRowsForm';
import classes from './PertModal.module.css';
import { getConfig } from '../utils/get-config';
import Field from './Field';
import Logo from './Logo';
import { MdMinimize, MdClose } from 'react-icons/md';

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
  },
};

const PertModal = () => {
  const input = useRef<HTMLElement | null>(null);
  const { round_to_next_minutes } = getConfig();

  const { pertData, setIsPertModalOpen, isPertModalOpen, resetPertData } =
    useContext(PertRowsContext) as PertContextType;

  const handleClosePertModal = () => {
    setIsPertModalOpen(false);
  };

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
            <header className={classes.header}>
              <Message
                message="Time values can be either hour value (1.5) or hours and
                  minutes (1h 30m)"
                type="info"
              />
              <button type="button" onClick={handleClosePertModal}>
                <MdMinimize />
              </button>
              <button
                type="button"
                onClick={() => {
                  resetPertData();
                  handleClosePertModal();
                }}
              >
                <MdClose />
              </button>
            </header>
            <div className={classes.top}>
              <div>
                <p>
                  Time values can be either hour value (1.5) or hours and
                  minutes (1h 30m)
                </p>
              </div>
              <Field
                label="Analysis, solution design and/or scoping"
                name="scoping"
              />

              <PertRowsForm />

              <Field
                label="Automated Tests"
                name="automatedTests"
                type="checkbox"
                required={false}
              />
            </div>

            <section className={classes.pertFieldset}>
              <header className={classes.pertLegend}>Preview</header>
              <PertTable pertData={pertData} />
            </section>

            <footer className={classes.footer}>
              <button type="submit">Add comment</button>
              <Logo />
            </footer>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default PertModal;
