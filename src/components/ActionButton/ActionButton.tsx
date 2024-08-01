import { FC, Fragment, ReactNode, SyntheticEvent, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';

import { waitFor } from '@/utils';

interface ActionButtonProps {
  clickAction: (e: SyntheticEvent) => void;
  actionLabel: ReactNode;
  progressLabel?: string;
  className?: string;
  disabled?: boolean;
}

const ActionButton: FC<ActionButtonProps> = (props) => {
  const {
    clickAction,
    actionLabel,
    progressLabel = '',
    className = '',
    disabled = false,
  } = props;
  const [inProgress, setInProgress] = useState(false);

  const handleOnClick = async (e: SyntheticEvent) => {
    setInProgress(true);
    clickAction(e);
    await waitFor(700);
    setInProgress(false);
  };

  return (
    <button
      onClick={handleOnClick}
      type="button"
      className={className}
      disabled={disabled}
    >
      {inProgress && progressLabel ? (
        <Fragment>
          <MdCheckCircle /> {progressLabel}
        </Fragment>
      ) : (
        <Fragment>{actionLabel}</Fragment>
      )}
    </button>
  );
};

export default ActionButton;
