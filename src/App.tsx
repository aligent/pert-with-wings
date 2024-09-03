import { FC, useEffect, useState } from 'react';

import PertModal from '@/components/PertModal';
import PertContextProvider from '@/context/pertContext';

import { IPertData } from './@types/pertData';
import classes from './App.module.css';
import { getConfig } from './utils';

const App: FC = () => {
  const [pertData, setPertData] = useState<IPertData>();

  useEffect(() => {
    const getPertData = async () => {
      const pertData = await getConfig();
      setPertData(pertData);
    };

    // Pre-load the Pert data
    getPertData();
  }, []);

  return pertData ? (
    <PertContextProvider config={pertData}>
      <div className={classes.App}>
        <PertModal />
      </div>
    </PertContextProvider>
  ) : null;
};

export default App;
