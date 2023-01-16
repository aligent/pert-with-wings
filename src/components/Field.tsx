import { useContext } from 'react';
import { IPertData, PertContextType } from '../@types/pertData';
import { PertRowsContext } from '../context/pertRowsContext';
import classes from './Field.module.css';

interface Props {
  label: string;
  name: string;
  type?: 'checkbox' | 'text' | 'select';
  values?: string[];
  required?: boolean;
}

const Field: React.FC<Props> = ({
  label,
  name,
  type = 'text',
  required = true,
  values,
}) => {
  const { pertData, updateField } = useContext(
    PertRowsContext
  ) as PertContextType;

  return (
    <div className={classes.field}>
      <label htmlFor={name} className={classes.label}>
        {label}
        {type === 'checkbox' && <i />}
      </label>
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          onChange={updateField}
          value={pertData.risk}
        >
          <option value="">Select</option>
          {values?.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={(pertData as any)[name]}
          onChange={updateField}
          required={required}
        />
      )}
    </div>
  );
};

export default Field;
