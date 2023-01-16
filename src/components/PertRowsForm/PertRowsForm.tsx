import React, { useContext, useEffect, useMemo, useState } from 'react';

import { IPertRow, PertContextType } from '@/@types/pertData';
import { PertContext } from '@/context/pertContext';
import { getMinutes, getSums, getTimeString } from '@/utils';
import Message from '@/components/Message';

import classes from './PertRowsForm.module.css';

const VALIDATE_HOUR_MINUTES = {
  pattern:
    '^((\\d*\\.?\\d+)[Mm]?|((\\d*\\.?\\d+)[Hh] ?((\\d*\\.?\\d+)[Mm])?))$',
  title:
    'Time values can be either hour value (1.5) or hours and minutes (1h 30m)',
};

const PertRowsForm = () => {
  const [pertWarning, setPertWarning] = useState('');

  const {
    pertData,
    updatePertRow,
    addPertRow,
    removePertRow,
    updatePertMessage,
  } = useContext(PertContext) as PertContextType;

  const { likely } = useMemo(() => getSums(pertData), [pertData]);

  useEffect(() => {
    setPertWarning(
      likely > 5 * 60
        ? 'Development tasks estimate is more than 5 hours. Consider breaking the task down further into separate smaller sized tickets.'
        : ''
    );
  }, [likely]);

  const getRowMinutes = (rowData: IPertRow) => {
    return {
      optimisticMinutes: getMinutes(rowData.optimistic),
      likelyMinutes: getMinutes(rowData.likely),
      pessimisticMinutes: getMinutes(rowData.pessimistic),
    };
  };
  const updateWarnings = (rowData: IPertRow, id: string) => {
    const { optimisticMinutes, likelyMinutes, pessimisticMinutes } =
      getRowMinutes(rowData);

    if (
      Math.abs(likelyMinutes - optimisticMinutes) ===
      Math.abs(pessimisticMinutes - likelyMinutes)
    ) {
      updatePertMessage(
        id,
        'warning',
        `🤔 Is your variance really ${getTimeString(
          Math.abs(pessimisticMinutes - likelyMinutes)
        )} less or more?`
      );
      return;
    }

    if (likelyMinutes > 5 * 60) {
      updatePertMessage(
        id,
        'warning',
        'Estimate is more than 5 hours. Consider breaking the task down further into separate smaller sized tickets.'
      );
      return;
    }

    updatePertMessage(id, 'warning', '');
  };

  const updateErrors = (rowData: IPertRow, id: string) => {
    const { optimisticMinutes, likelyMinutes, pessimisticMinutes } =
      getRowMinutes(rowData);

    if (optimisticMinutes >= likelyMinutes) {
      updatePertMessage(
        id,
        'error',
        "Lilkely estimate can't be less than Optimisitc Estimate."
      );
      return;
    }

    if (likelyMinutes >= pessimisticMinutes) {
      updatePertMessage(
        id,
        'error',
        "Pessimistic estimate can't be less than Likely Estimate."
      );
      return;
    }

    updatePertMessage(id, 'error', '');
  };

  const handleChange = (id: string) => {
    const rowData = pertData.pertRows.find((row) => row.id === id);
    if (!rowData) return;

    updateWarnings(rowData, id);

    const { optimistic, likely, pessimistic } = rowData;
    if (optimistic === '' || likely === '' || pessimistic === '') return;

    updateErrors(rowData, id);
  };

  return (
    <div className={classes.pertRowsForm}>
      {pertData.pertRows.map((row: IPertRow) => (
        <React.Fragment key={row.id}>
          <div className={classes.row}>
            <div className={classes.control}>
              <input
                onChange={(e) => updatePertRow(row.id, e)}
                name="task"
                id="task"
                type="text"
                value={row.task}
                className={`${classes.field}`}
                autoFocus
                placeholder="Task"
              />
              <label className={classes.label} htmlFor="task">
                <span>Task</span>
              </label>
            </div>
            <div className={classes.control}>
              <input
                onChange={(e) => {
                  updatePertRow(row.id, e);
                  handleChange(row.id);
                }}
                name="optimistic"
                id="optimistic"
                type="text"
                value={row.optimistic}
                {...VALIDATE_HOUR_MINUTES}
                required
                className={classes.field}
                placeholder="Optimistic"
              />
              <label className={classes.label} htmlFor="optimistic">
                <span>Optimistic</span>
              </label>
            </div>
            <div className={classes.control}>
              <input
                onChange={(e) => {
                  updatePertRow(row.id, e);
                  handleChange(row.id);
                }}
                name="likely"
                id="likely"
                type="text"
                value={row.likely}
                {...VALIDATE_HOUR_MINUTES}
                required
                className={classes.field}
                placeholder="Likely"
              />
              <label className={classes.label} htmlFor="likely">
                <span>Likely</span>
              </label>
            </div>
            <div className={classes.control}>
              <input
                onChange={(e) => {
                  updatePertRow(row.id, e);
                  handleChange(row.id);
                }}
                // onBlur={() => handleOnBlur(row.id)}
                name="pessimistic"
                id="pessimistic"
                type="text"
                value={row.pessimistic}
                {...VALIDATE_HOUR_MINUTES}
                required
                className={classes.field}
                placeholder="Pessimistic"
              />
              <label className={classes.label} htmlFor="pessimistic">
                <span>Pessimistic</span>
              </label>
            </div>
            {pertData.pertRows.length > 1 && (
              <button type="button" onClick={() => removePertRow(row.id)}>
                🗑️
              </button>
            )}
          </div>
          {row.error && <Message message={row.error} type="error" />}
          {row.warning && <Message message={row.warning} type="warning" />}
        </React.Fragment>
      ))}
      <button className={classes.addTask} type="button" onClick={addPertRow}>
        + Add another task
      </button>
      {pertData.pertRows.length > 1 && pertWarning && (
        <Message message={pertWarning} type="warning" />
      )}
    </div>
  );
};

export default PertRowsForm;
