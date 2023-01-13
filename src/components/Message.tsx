import classes from './Message.module.css';

interface Props {
  message: string;
  type?: 'error' | 'warning';
}

const Message: React.FC<Props> = ({ message, type = 'error' }) => {
  return <div className={`${classes.message} ${classes[type]}`}>{message}</div>;
};

export default Message;
