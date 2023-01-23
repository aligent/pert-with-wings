import { FC, useContext } from 'react';
import { MdClose, MdMinimize } from 'react-icons/md';

import { PertContextType } from '@/@types/pertData';
import Message from '@/components/Message';
import { PertContext } from '@/context/pertContext';

import classes from './Header.module.css';

const Header: FC = () => {
  const { setIsPertModalOpen, resetPertData, pertData } = useContext(
    PertContext
  ) as PertContextType;
  const { round_to_next_minutes } = pertData;

  return (
    <header className={classes.header}>
      <Message
        message={`Time values can be either hour value (1.5) or hours and
      minutes (1h 30m). ${
        round_to_next_minutes
          ? `Totals will be rounded to next ${round_to_next_minutes} minutes.`
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
