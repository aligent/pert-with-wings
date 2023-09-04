import { FC, useContext } from 'react';
import { MdClose, MdMinimize } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import { PertContextType } from '@/@types/pertData';
import Message from '@/components/Message';
import { PertContext } from '@/context/pertContext';

import classes from './Header.module.css';

const Header: FC = () => {
  const { setIsPertModalOpen, resetPertData, pertData } = useContext(
    PertContext
  ) as PertContextType;
  const { t } = useTranslation();
  const { round_to_next_minutes } = pertData;

  return (
    <header className={classes.header}>
      <Message
        message={t('headerNote', {
          roundToNextMinutes: round_to_next_minutes
            ? `Totals will be rounded to next ${round_to_next_minutes} minutes. `
            : '',
        })}
        type="info"
        isSlim={true}
      />
      <button
        className={classes.headerButton}
        type="button"
        onClick={() => setIsPertModalOpen(false)}
      >
        <MdMinimize size={20} />
      </button>
      <button
        className={classes.headerButton}
        type="button"
        onClick={() => {
          setIsPertModalOpen(false);
        }}
      >
        <MdClose size={20} />
      </button>
    </header>
  );
};

export default Header;
