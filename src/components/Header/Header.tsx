import { useContext } from 'react';
import { MdMinimize, MdClose } from 'react-icons/md';

import { PertContextType } from '@/@types/pertData';
import { PertRowsContext } from '@/context/pertRowsContext';
import { getConfig } from '@/utils';
import Message from '@/components/Message';

import classes from './Header.module.css';

interface Props {}

const Header: React.FC<Props> = () => {
  const { setIsPertModalOpen, resetPertData } = useContext(
    PertRowsContext
  ) as PertContextType;
  const { round_to_next_minutes } = getConfig();

  return (
    <header className={classes.header}>
      <Message
        message={`Time values can be either hour value (1.5) or hours and
      minutes (1h 30m). ${
        round_to_next_minutes
          ? `Totals will be rounded to next ${round_to_next_minutes} minutes`
          : ''
      }`}
        type="info"
      />
      <button type="button" onClick={() => setIsPertModalOpen(false)}>
        <MdMinimize />
      </button>
      <button
        type="button"
        onClick={() => {
          resetPertData();
          setIsPertModalOpen(false);
        }}
      >
        <MdClose />
      </button>
    </header>
  );
};

export default Header;
