import { FC } from 'react';

import PertModal from '@/components/PertModal';
import PertContextProvider from '@/context/pertContext';

import classes from './App.module.css';

const App: FC = () => {
  return (
    <PertContextProvider>
      <div className={classes.App}>
        <PertModal />
      </div>
    </PertContextProvider>
  );
};

export default App;
