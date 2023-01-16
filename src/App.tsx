import PertContextProvider from '@/context/pertContext';
import PertModal from '@/components/PertModal';

import classes from './App.module.css';

function App() {
  return (
    <PertContextProvider>
      <div className={classes.App}>
        <PertModal />
      </div>
    </PertContextProvider>
  );
}

export default App;
