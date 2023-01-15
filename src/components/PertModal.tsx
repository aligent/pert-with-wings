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

            <div className={classes.footer}>
              <button type="submit">Add comment</button>
              <button
                className={classes.addComment}
                type="button"
                onClick={handleClosePertModal}
              >
                Cancel
              </button>
              <svg
                className={classes.logo}
                xmlns="http://www.w3.org/2000/svg"
                width="196"
                height="50"
                fill="none"
                viewBox="0 0 196 50"
              >
                <path
                  fill="currentColor"
                  d="M179.192 24.762c5.125-1.03 9.879-3.793 14.115-6.747.366-.255.403-.046.334.209-3.524 13.053-18.492 12.619-20.728 12.554-.126-.004-.211-.006-.252-.005-.405.011-.64.45-.039.645l.003.001c.956.313 5.337 1.745 16.497-.597.291-.062.289.083.191.216-2.862 3.89-12.195 7.383-20.765 5.451-.739-.165-.874.343-.52.515 2.174 1.06 6.38 2.638 15.853 2.06.216-.013.114.194-.028.31-8.353 6.8-20.753 1.83-22.063 1.306-.058-.023-.094-.038-.107-.042-.613-.2-.691.169-.466.366.049.044.11.102.182.17.906.864 3.755 3.58 12.942 5.223.332.06.169.228-.027.288-.232.072-.446.142-.652.21-.692.226-1.283.42-2.094.52-10.556 1.307-15.872-3.937-17.258-5.305-.186-.183-.301-.297-.349-.316-.093-.036-.247-.057-.283.037-.03.076.329 2.641 6.708 7.709l.036.028c.096.075.254.197.281.29.04.14-.078.14-.193.139h-.018c-10.58 0-14.395-11.975-14.534-18.96-.008-.396.093-.672.437-.56a11.503 11.503 0 0 0 5.837 1.422c5.728-.16 10.589-4.216 11.6-9.787.026-.145.075-.292.26-.33 10.856-2.202 21.531-10.611 31.103-21.564.262-.3.384-.291.391.033.297 15.361-13.809 21.563-19.014 23.852l-.488.215c-.052.023-.102.047-.151.07-.072.035-.141.067-.209.095-.369.147-.226.395-.015.524.209.128.638.107.943.091.066-.003.126-.006.177-.007.796-.018 1.584-.173 2.363-.33Z"
                />
                <path
                  fill="currentColor"
                  d="M174.099 9.083c.301.095.517.26.659.47.24.356.27.837.148 1.315-.18.7-.655 1.295-1.098 1.848-.534.665-1.134 1.273-1.741 1.871a18.905 18.905 0 0 1-2.742 2.246 13.447 13.447 0 0 1-3.193 1.585c-.526.176-1.062.34-1.618.385a.834.834 0 0 1-.283-.014c-.107-.03-.22-.109-.241-.225-.034-.188.122-.308.255-.404.326-.236.664-.457 1.002-.68.127-.083.255-.166.382-.251a22.497 22.497 0 0 0 2.823-2.19c.9-.832 1.745-1.72 2.533-2.66a34.557 34.557 0 0 0 2.029-2.679c.182-.265.388-.553.7-.633a.702.702 0 0 1 .385.016ZM165.925 7.623c.296-.755.591-1.51.902-2.258.197-.474.726-.8 1.249-.592.485.194.758.666.817 1.168.075.638-.179 1.25-.422 1.824-.25.589-.501 1.178-.792 1.747-.793 1.554-1.939 2.886-3.221 4.057a5.839 5.839 0 0 0-.078.071c-.373.344-.983.906-1.487.828-.246-.038-.266-.282-.199-.482.082-.242.215-.462.347-.68l.349-.571a32.99 32.99 0 0 0 1.144-1.964 26.4 26.4 0 0 0 1.172-2.588l.219-.56ZM162.012 2.912c.355.227.575.626.661 1.04.087.412.055.84-.002 1.258a10.304 10.304 0 0 1-.937 3.136 9.473 9.473 0 0 1-1.283 1.957c-.139.166-.565.678-.716.327-.045-.105-.025-.225-.005-.338.357-1.98.583-3.983.658-5.993.019-.492.059-1.05.44-1.363.326-.267.828-.25 1.184-.024ZM156.835 4.236a6.22 6.22 0 0 1-.511 4.15c-.071.142-.204.186-.33.069a.632.632 0 0 1-.132-.213c-.244-.55-.421-1.128-.59-1.706a25.617 25.617 0 0 1-.478-1.825c-.09-.414-.163-.834-.157-1.258.003-.216.032-.444.163-.615.213-.278.635-.313.959-.181.307.125.555.37.728.652.172.283.274.604.348.927ZM149.301 4.041c.302-.22.802-.112 1.109.042.51.278.725.85.829 1.39.093.482.131.973.132 1.463l.003.09c.011.288.04 1.008-.306.83-.143-.074-.264-.224-.374-.36a3.762 3.762 0 0 0-.102-.123c-.167-.19-.329-.384-.483-.584a7.254 7.254 0 0 1-.791-1.255c-.194-.398-.469-1.164-.017-1.493ZM146.516 9.2c.346-.059.176-.57.088-.768a40.955 40.955 0 0 1-.066-.147c-.244-.551-.498-1.124-.985-1.502-.296-.23-.7-.369-1.05-.235-.257.098-.457.356-.45.632.006.271.193.501.384.694.303.307.64.58 1 .818.184.121.374.234.568.337l.074.041c.136.076.279.157.437.13ZM141.671 10.893c.378.183.775.381 1.05.708.026.03.051.063.075.097.122.171.181.376-.049.47-.442.178-.939.15-1.411.125-.07-.004-.139-.008-.207-.01a13.514 13.514 0 0 0-.282-.01c-.39-.01-.788-.02-1.154-.158a.698.698 0 0 1-.288-.18c-.151-.173-.142-.439-.053-.65.145-.345.474-.595.838-.684.511-.125 1.025.07 1.481.292ZM139.007 15.61c.483.064.971.253 1.325.595.195.18.239.38-.05.462-.197.056-.402.09-.607.122-.153.025-.307.05-.457.084-.368.084-.733.186-1.092.303-.309.102-.609.224-.909.347-.297.12-.592.242-.896.342-.147.048-.342.094-.449-.054a.43.43 0 0 1-.065-.163c-.104-.486.17-1.004.522-1.322.35-.317.804-.5 1.263-.613a3.821 3.821 0 0 1 1.415-.104ZM139.828 20.479c.062.02.105.054.134.097.054.082.054.197.015.302-.093.253-.917.919-1.116 1.076-.636.504-1.195 1.113-1.747 1.714l-.311.336c-.236.254-.458.527-.681.801-.389.477-.78.957-1.247 1.34-.111.092-.23.184-.37.215-.557.12-.504-.739-.479-1.058a3.205 3.205 0 0 1 .52-1.52c.289-.433.728-1.026 1.132-1.354a10.122 10.122 0 0 1 1.595-1.055c.383-.206.778-.39 1.18-.557l.068-.028c.355-.147.699-.29 1.086-.325a.56.56 0 0 1 .221.016ZM139.662 25.524l.164-.18c.231-.254.47-.49.784-.64.102-.048.222-.088.323-.04.088.042.136.14.143.237a.709.709 0 0 1-.053.282 7.94 7.94 0 0 1-.456 1.014l-.078.154c-.431.858-.805 1.74-1.141 2.638-.87 2.327-1.446 4.754-1.887 7.195-.041.226-.129.686-.358.802a.283.283 0 0 1-.224.002c-.353-.132-.57-.536-.721-.855a5.21 5.21 0 0 1-.483-1.904c-.159-2.255 1.383-5.014 2.525-6.838.521-.831.85-1.193 1.462-1.867ZM142.603 28.578l-.011.022c-3.151 5.976-2.759 14.94 2.934 17.965l.002.001c.211.112.427.226.668.252.045.005.096.006.131-.023.036-.029.045-.078.048-.123.013-.215-.089-.45-.179-.66-.022-.052-.044-.102-.063-.15a40.273 40.273 0 0 0-.143-.35c-.068-.164-.136-.327-.199-.492a34.947 34.947 0 0 1-1.579-5.33 38.599 38.599 0 0 1-.741-5.405 46.722 46.722 0 0 1-.081-4.296c.005-.166.014-.332.023-.497.015-.266.029-.532.025-.796-.003-.202-.054-.614-.325-.627-.236-.01-.415.329-.51.51Z"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M16.38 37.878c-2.13 0-3.809-.614-4.26-2.539-1.72 1.31-4.053 2.58-6.592 2.58C2.17 37.919 0 36.036 0 33.251c0-4.873 6.142-6.51 11.998-7.575V23.75c0-2.539-.369-3.44-2.17-3.44-1.556 0-2.416.82-3.03 2.744-.574 1.72-1.72 2.457-3.195 2.457-1.351 0-2.334-.82-2.334-2.539 0-3.03 3.85-5.077 9.214-5.077 4.176 0 7.82 1.555 7.82 6.142v9.459c0 1.105.41 1.556 1.106 1.556.287 0 .696-.041 1.188-.287v2.088c-1.147.696-2.375 1.024-4.218 1.024Zm-7.658-3.726c1.228 0 2.293-.492 3.276-1.188V28.05c-3.317.656-5.528 1.639-5.528 3.89 0 1.516 1.023 2.212 2.252 2.212Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  d="M33.004 35.667v1.72H22.153v-1.72c1.842-.205 2.293-.573 2.293-1.802V14.374c0-.86-.287-1.228-1.024-1.228h-1.27v-1.597s1.853-.606 3.392-1.382c1.54-.776 2.874-2.058 2.874-2.058h2.293v25.756c0 1.229.41 1.597 2.293 1.802ZM36.484 11.958c0-1.72 1.27-3.44 3.645-3.44 2.293 0 3.644 1.72 3.644 3.44 0 1.679-1.351 3.358-3.645 3.358-2.374 0-3.644-1.68-3.644-3.358ZM45.41 35.667v1.72H34.56v-1.72c1.842-.205 2.293-.573 2.293-1.802V24.16c0-.86-.287-1.228-1.024-1.228h-1.27v-1.597s1.96-.396 3.625-1.474c1.829-1.184 2.64-1.965 2.64-1.965h2.294v15.969c0 1.229.41 1.597 2.293 1.802Z"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M65.23 19.415c-.275-.235-.531-.455-1.024-.455-.492 0-.983.328-1.393.9 1.516 1.23 2.334 2.95 2.334 4.997 0 4.053-3.276 6.96-8.64 6.96-1.29 0-2.084-.15-2.71-.268-.407-.077-.742-.14-1.097-.14-.901 0-1.311.368-1.311.859 0 .942 2.047 1.188 7.74 1.392 5.814.205 8.107 2.048 8.107 5.57 0 4.217-4.586 6.305-10.442 6.305-4.586 0-9.582-1.105-9.582-4.668 0-1.474.86-2.375 2.13-2.948-1.352-.778-2.089-1.965-2.089-3.808 0-2.211 1.31-3.604 3.112-4.095-1.638-1.228-2.538-3.03-2.538-5.16 0-4.053 3.276-6.96 8.68-6.96 1.474 0 2.785.204 3.932.614 1.35-1.761 3.357-3.072 5.568-3.072 1.475 0 2.785.738 2.785 2.335 0 1.228-.9 2.21-2.13 2.21-.77 0-1.114-.295-1.433-.568ZM53.6 24.857c0 3.03.86 4.545 2.908 4.545 2.006 0 2.866-1.515 2.866-4.545 0-2.99-.86-4.546-2.866-4.546-2.048 0-2.908 1.556-2.908 4.546Zm3.194 18.262c3.645 0 5.242-1.187 5.242-2.21 0-1.23-.901-1.434-4.587-1.557-1.842-.082-3.48-.205-4.831-.45-.901.327-1.434.942-1.434 1.638 0 1.35 1.68 2.58 5.61 2.58Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M78.374 17.896c5.896 0 9.131 3.44 9.131 8.967H74.77c-.04.369-.04.737-.04 1.064 0 4.832 1.473 7.33 5.077 7.33 2.375 0 4.586-1.637 6.019-4.545l2.252 1.27c-1.76 3.603-4.34 6.019-9.05 6.019-6.756 0-10.769-4.218-10.769-10.073 0-5.815 4.095-10.032 10.115-10.032Zm.123 2.456c-2.253 0-3.236 1.31-3.604 3.89h6.674c0-2.416-1.228-3.89-3.07-3.89Z"
                  clipRule="evenodd"
                />
                <path
                  fill="currentColor"
                  d="M113.179 35.667v1.72h-10.851v-1.72c1.884-.205 2.293-.573 2.293-1.802v-9.746c0-1.965-1.146-2.743-2.662-2.743-1.351 0-2.538.45-3.685 1.229v11.26c0 1.229.41 1.597 2.293 1.802v1.72h-10.85v-1.72c1.842-.205 2.292-.573 2.292-1.802V24.16c0-.86-.287-1.228-1.023-1.228h-1.27v-1.597s1.036-.173 3.349-1.328 2.916-2.111 2.916-2.111h2.293v2.006c1.638-1.065 4.054-2.006 6.143-2.006 3.03 0 6.469 1.064 6.469 6.387v9.582c0 1.229.451 1.597 2.293 1.802ZM124.44 35.176c.696 0 1.679-.164 2.293-.41v2.498c-1.147.368-2.989.696-4.505.696-3.89 0-6.306-1.31-6.306-5.57V21.13h-2.252v-1.597c3.44-1.269 5.365-3.603 6.224-7.207h2.334v6.184h4.505v2.62h-4.505v11.26c0 2.048.86 2.786 2.212 2.786Z"
                />
              </svg>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default PertModal;
