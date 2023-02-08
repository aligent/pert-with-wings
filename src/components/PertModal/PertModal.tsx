import { CSSProperties, FC, useContext, useRef } from 'react';
import ReactModal from 'react-modal';

import { PertContextType } from '@/@types/pertData';
import AdvancedSettings from '@/components/AdvancedSettings';
import Field from '@/components/Field';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import PertRowsForm from '@/components/PertRowsForm';
import PertTable from '@/components/PertTable';
import { PertContext } from '@/context/pertContext';
import { handleMouseOver } from '@/utils';

import classes from './PertModal.module.css';

const IS_JIRA = window.location.hostname.includes('atlassian.net');

const pertModalStyles = {
  overlay: {
    zIndex: 401287331 + 1,
    backdropFilter: 'blur(5px)',
    overflow: 'auto',
    padding: 40,
  } as CSSProperties,
  content: {
    position: 'static',
    maxWidth: '760px',
    margin: 'auto',
    padding: 0,
    border: 0,
    background: 'none',
    overflow: 'visible',
  } as CSSProperties,
};

const PertModal: FC = () => {
  const input = useRef<HTMLElement | null>(null);
  const pertHtmlRef = useRef<HTMLDivElement>(null);

  const { pertData, setIsPertModalOpen, isPertModalOpen } = useContext(
    PertContext
  ) as PertContextType;

  const getMarkup = () => {
    if (!pertHtmlRef.current) return;

    return pertHtmlRef.current.innerHTML;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!input.current) return;

    const html = getMarkup();

    // clear the message box if it's just the placeholder
    if (
      input.current.textContent === 'Type @ to mention and notify someone.' ||
      input.current.textContent === 'Add a comment…'
    ) {
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
      alert('Please click on comment box before using PERT With Wings.');
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
        onMouseOver={handleMouseOver}
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
                label="Analysis/Solution Design, Scoping and Documenting"
                name="scoping"
              />

              <Field
                label="Automated Tests"
                description={`${pertData.automated_tests_percent}% of dev task.`}
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

              <AdvancedSettings />
            </div>

            <section className={classes.pertFieldset}>
              <header className={classes.pertLegend}>Preview</header>
              <PertTable forwardRef={pertHtmlRef} />
            </section>

            <footer className={classes.footer}>
              <button type="submit" id="add-pert-estimate">
                Add PERT Estimate
              </button>
              <Logo />
            </footer>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default PertModal;
