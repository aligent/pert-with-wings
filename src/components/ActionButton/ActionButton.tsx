import { FC, Fragment, SyntheticEvent, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';

import { waitFor } from '@/utils';

interface ActionButtonProps {
  clickAction: (e: SyntheticEvent) => void;
  actionLabel: string;
  progressLabel: string;
}

const ActionButton: FC<ActionButtonProps> = (props) => {
  const { clickAction, actionLabel, progressLabel } = props;
  const [inProgress, setInProgress] = useState(false);

  const handleOnClick = async (e: SyntheticEvent) => {
    setInProgress(true);
    clickAction(e);
    await waitFor(700);
    setInProgress(false);
  };

  return (
    <button onClick={handleOnClick} type="button">
      {inProgress ? (
        <Fragment>
          <MdCheckCircle /> {progressLabel}
        </Fragment>
      ) : (
        actionLabel
      )}
    </button>
  );
};

export default ActionButton;
