import PertRowsProvider from '@/context/pertRowsContext';
import PertModal from '@/components/PertModal';

import classes from './App.module.css';

function App() {
  return (
    <PertRowsProvider>
      <div className={classes.App}>
        <PertModal />
      </div>
    </PertRowsProvider>
  );
}

export default App;
