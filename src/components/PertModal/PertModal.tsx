import {
  CSSProperties,
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  MdCheckCircle,
  MdContentCopy,
  MdOutlineSmsFailed,
} from 'react-icons/md';
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

const IS_JIRA =
  window.location.hostname.includes('atlassian.net') ||
  window.location.pathname.startsWith('/browse/');

const IS_AZURE = window.location.hostname.includes('dev.azure.com');

const pertModalStyles = {
  overlay: {
    zIndex: 401287331 + 1,
    overflow: 'auto',
    padding: 40,
    backgroundColor: 'var(--pert-modal-backdrop)',
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
  const inputRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pertHtmlRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const azureHasParam = urlParams.get('workitem');

  const {
    pertData,
    setIsPertModalOpen,
    isPertModalOpen,
    ticketNo,
    setTicketNo,
  } = useContext(PertContext) as PertContextType;

  const getMarkup = () => {
    if (!pertHtmlRef.current) return;

    return pertHtmlRef.current;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!inputRef.current) return;

    const html = getMarkup();

    if (!html) return;

    // clear the message box if it's just the placeholder
    if (
      inputRef.current.textContent ===
        'Type @ to mention and notify someone.' ||
      inputRef.current.textContent === 'Add a comment…'
    ) {
      inputRef.current.innerHTML = '';
    }

    inputRef.current.appendChild(html);

    setIsPertModalOpen(false);
  };

  const isValidPert = useMemo(() => {
    return pertData.pertRows.every(
      (row) =>
        row.error === '' &&
        row.pessimistic !== '' &&
        row.likely !== '' &&
        row.optimistic
    );
  }, [pertData]);

  const handleOpen = () => {
    inputRef.current =
      (
        document.querySelector(`iframe[id^="mce_"]`) as HTMLIFrameElement
      )?.contentWindow?.document.getElementById('tinymce') || // old jira comment
      document.querySelector('[aria-label="edit-box"]') || // Azure devops edit mode
      document.querySelector('[aria-label="Discussion"]') || // Azure devops comment
      document.querySelector('div[contenteditable="true"]'); // new jira comment

    if (!inputRef.current) {
      alert('Please click on comment box before using PERT With Wings.');
      return;
    }

    setIsPertModalOpen(true);
  };

  const handleCopy = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    if (!pertHtmlRef.current) return;

    const html = getMarkup();
    if (!html) return;

    setCopied(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    setCopied(false);

    const blobInput = new Blob([html.innerHTML], { type: 'text/html' });
    const clipboardItemInput = new ClipboardItem({ 'text/html': blobInput });
    navigator.clipboard.write([clipboardItemInput]);

    setIsPertModalOpen(false);
  };

  useEffect(() => {
    const ticketModalSelector = IS_JIRA
      ? '.atlaskit-portal-container'
      : '.new-workitem-dialog';

    const $ticketModalSelector: HTMLElement | null =
      document.querySelector(ticketModalSelector);

    if (
      window.location.pathname.startsWith('/browse/') ||
      (IS_AZURE && azureHasParam === null)
    ) {
      const itemNo = window.location.pathname.split('/').pop();
      const ticket = IS_AZURE ? `AZURE-${itemNo}` : itemNo;

      setTicketNo(ticket);
    } else {
      const selectedIssue = IS_AZURE
        ? `AZURE-${urlParams.get('workitem')}`
        : urlParams.get('selectedIssue');

      setTicketNo(selectedIssue);
    }

    if ($ticketModalSelector) {
      $ticketModalSelector.inert = isPertModalOpen;
    }
  }, [isPertModalOpen, ticketNo]);

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
          <form
            onSubmit={handleSubmit}
            action=""
            className={classes.pertForm}
            ref={formRef}
          >
            <Header />
            <main className={classes.main}>
              <div className={classes.top}>
                <PertRowsForm />

                <Field
                  label="TestAnalysis/Solution Design, Scoping and Documenting"
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
            </main>
            <footer className={classes.footer}>
              <button
                type="submit"
                id="add-pert-estimate"
                disabled={!isValidPert}
              >
                Add Estimate
              </button>
              <button
                className={classes.buttonSecondary}
                type="submit"
                onClick={(e) => handleCopy(e)}
                disabled={!isValidPert}
              >
                {copied ? (
                  <Fragment>
                    <MdCheckCircle />
                    Copied
                  </Fragment>
                ) : (
                  <Fragment>
                    <MdContentCopy />
                    Copy Estimate
                  </Fragment>
                )}
              </button>
              <a
                target="_blank"
                href="https://aligent.atlassian.net/jira/software/c/projects/PERT/issues/"
                className={classes.feedback}
              >
                <MdOutlineSmsFailed /> Give feedback or report a bug
              </a>
              <Logo />
            </footer>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default PertModal;
