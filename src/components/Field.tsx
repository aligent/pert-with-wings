import { useContext } from 'react';
import { IPertData, PertContextType } from '../@types/pertData';
import { PertRowsContext } from '../context/pertRowsContext';
import classes from './Field.module.css';

interface Props {
  label: string;
  name: string;
  type?: 'checkbox' | 'text';
  required?: boolean;
}

const Field: React.FC<Props> = ({
  label,
  name,
  type = 'text',
  required = true,
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
      <input
        type={type}
        id={name}
        name={name}
        value={(pertData as any)[name]}
        onChange={updateField}
        required={required}
      />
    </div>
  );
};

export default Field;
