import { FC } from 'react';

import classes from './Message.module.css';

interface Props {
  message: string;
  type?: 'error' | 'warning' | 'info';
  isSlim?: boolean;
}

const Message: FC<Props> = ({ message, type = 'error', isSlim = false }) => {
  return (
    <div
      className={`${classes.message} ${classes[type]} ${
        isSlim ? classes.messageSlim : ''
      }`}
    >
      {message}
    </div>
  );
};

export default Message;
