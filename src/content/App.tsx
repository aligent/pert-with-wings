import { FC, useEffect, useState } from 'react';

import { IPertData } from '@/@types/pertData';
import PertModal from '@/components/PertModal';
import PertContextProvider from '@/context/pertContext.tsx';
import { getConfig } from '@/utils';

import classes from './App.module.css';

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
