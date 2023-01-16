import classes from './Message.module.css';

interface Props {
  message: string;
  type?: 'error' | 'warning' | 'info';
}

const Message: React.FC<Props> = ({ message, type = 'error' }) => {
  return <div className={`${classes.message} ${classes[type]}`}>{message}</div>;
};

export default Message;
