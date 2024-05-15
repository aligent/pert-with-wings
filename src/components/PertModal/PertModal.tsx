import classNames from 'classnames';
import {
  CSSProperties,
  FC,
  Fragment,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdCheckCircle,
  MdContentCopy,
  MdOutlineSmsFailed,
} from 'react-icons/md';
import ReactModal from 'react-modal';

import { PertContextType } from '@/@types/pertData';
import ActionButton from '@/components/ActionButton';
import AdvancedSettings from '@/components/AdvancedSettings';
import Field from '@/components/Field';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import PertRowsForm from '@/components/PertRowsForm';
import PertTable from '@/components/PertTable';
import { PertContext } from '@/context/pertContext';
import {
  IS_JIRA,
  VALIDATE_HOUR_MINUTES,
  getIsIDAHOBIT,
  getRandomTranslation,
  getTicketNo,
  handleMouseOver,
  updateClipboard,
  waitFor,
} from '@/utils';

import classes from './PertModal.module.css';

const pertModalStyles = {
  overlay: {
    zIndex: 401287331 + 1,
    overflow: 'auto',
    padding: 40,
    backgroundColor: 'var(--pert-modal-backdrop)',
  } as CSSProperties,
  content: {
    position: 'static',
    maxWidth: '860px',
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

  const { pertData, setIsPertModalOpen, isPertModalOpen, setTicketNo } =
    useContext(PertContext) as PertContextType;

  const { t } = useTranslation();

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

    const ticket = getTicketNo();
    setTicketNo(ticket);

    setIsPertModalOpen(true);
  };

  const handleCopy = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    if (!pertHtmlRef.current) return;

    const html = getMarkup();
    if (!html) return;

    setCopied(true);
    await waitFor(700);
    setCopied(false);

    const blobInput = new Blob([html.innerHTML], { type: 'text/html' });
    const clipboardItemInput = new ClipboardItem({ 'text/html': blobInput });
    navigator.clipboard.write([clipboardItemInput]);

    setIsPertModalOpen(false);
  };

  const handleCopyTicketsForSlack = (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const hasSelection = window.getSelection()?.toString() !== '';

      if (hasSelection) {
        const selection = window.getSelection()?.getRangeAt(0)?.cloneContents();
        const ticketList = [
          ...(selection?.querySelectorAll(
            '[data-testid="native-issue-table.ui.issue-row"]'
          ) as NodeListOf<HTMLTableRowElement>),
          ...(selection?.querySelectorAll(
            '[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card.list-item"]'
          ) as NodeListOf<HTMLUListElement>),
        ]
          .filter((a) => a.hasAttribute('data-testid'))
          .map((ticket) => {
            const ticketLink =
              (ticket.querySelector(
                '[data-component-selector="jira-native-issue-table-issue-key"]'
              ) as HTMLAnchorElement) ||
              (ticket.querySelector(
                '[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card"]'
              ) as HTMLAnchorElement);
            const ticketDescription =
              (ticket.querySelector(
                '[data-testid="issue-field-inline-edit-read-view-container.ui.container"]'
              ) as HTMLDivElement) ||
              (ticket.querySelector(
                '[data-testid="issue-navigator.ui.issue-results.detail-view.card-list.card.summary"]'
              ) as HTMLDivElement);
            return `<li><a href="${ticketLink.href}">${
              ticketLink.href.match(/[A-Z]{2,}-\d+/)?.[0] || ''
            }: ${ticketDescription.textContent}</a></li>`;
          })
          .join('');
        updateClipboard(ticketList);
        return;
      }

      const ticketList = [
        ...(document.querySelectorAll(
          '[data-component-selector="VersionDetailIssueListIssueCardContainer"]'
        ) as NodeListOf<HTMLAnchorElement>),
      ]
        .map(
          (ticket) =>
            `<li><a href="${ticket.href}">${[...ticket.childNodes[0].childNodes]
              .map((a) => a.textContent)
              .filter(Boolean)
              .join(': ')}</a></li>`
        )
        .join('');

      if (!ticketList) {
        alert('Highlight what you want to copy');
        return;
      }

      updateClipboard(ticketList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const ticketModalSelector = IS_JIRA
      ? '.atlaskit-portal-container'
      : '.new-workitem-dialog';

    const $ticketModalSelector: HTMLElement | null =
      document.querySelector(ticketModalSelector);

    if ($ticketModalSelector) {
      $ticketModalSelector.inert = isPertModalOpen;
    }
  }, [isPertModalOpen]);

  return (
    <>
      <div className={classes.pertButtons}>
        <dl className={classes.jiraWithWingsTools}>
          <dt>
            <button className={classes.copyTicketsListButton} type="button">
              ✨
            </button>
          </dt>
          <dd>
            <ActionButton
              clickAction={handleCopyTicketsForSlack}
              actionLabel="Copy tickets list for Slack"
              progressLabel="Copied"
            />
          </dd>
        </dl>
        <button
          id={`pert-button-${IS_JIRA ? 'jira' : 'azure'}`}
          className={classNames(classes.openPertModalButton, {
            [classes.IDAHOBIT]: getIsIDAHOBIT(),
          })}
          onClick={handleOpen}
          onMouseOver={handleMouseOver}
          type="button"
        >
          {getRandomTranslation(
            t('pert', {
              returnObjects: true,
            })
          )}
        </button>
      </div>
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
                  label={t('scoping')}
                  name="scoping"
                  pattern={VALIDATE_HOUR_MINUTES}
                  errorMessage="Time values can be either hour value (1.5) or hours and minutes (1h 30m)"
                />

                <Field
                  label={t('automatedTests')}
                  description={`${pertData.automated_tests_percent}% of dev ${t(
                    'task'
                  )}.`}
                  name="automatedTests"
                  type="checkbox"
                  required={false}
                />

                <Field
                  label={t('complexity')}
                  name="risk"
                  type="select"
                  values={['Low', 'Medium', 'High']}
                  required={false}
                />

                <AdvancedSettings />
              </div>

              <section className={classes.pertFieldset}>
                <header className={classes.pertLegend}>{t('preview')}</header>
                <PertTable forwardRef={pertHtmlRef} />
              </section>
            </main>
            <footer className={classes.footer}>
              <button
                type="submit"
                id="add-pert-estimate"
                disabled={!isValidPert}
              >
                {t('addEstimate')}
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
                    {t('copyEstimate')}
                  </Fragment>
                )}
              </button>
              <a
                target="_blank"
                href="https://aligent.atlassian.net/jira/software/c/projects/PERT/issues/"
                className={classes.feedback}
              >
                <MdOutlineSmsFailed /> {t('feedback')}
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
