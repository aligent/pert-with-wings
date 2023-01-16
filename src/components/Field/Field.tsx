import { useContext } from 'react';
import classnames from 'classnames';

import { PertContextType } from '@/@types/pertData';
import { PertContext } from '@/context/pertContext';

import classes from './Field.module.css';

interface Props {
  label: string;
  description?: string;
  name: string;
  type?: 'checkbox' | 'text' | 'select' | 'range';
  values?: string[];
  required?: boolean;
}

const Field: React.FC<Props> = ({
  label,
  description,
  name,
  type = 'text',
  required = true,
  values,
}) => {
  const { pertData, updateField } = useContext(PertContext) as PertContextType;

  return (
    <div
      className={classnames(classes.field, {
        [classes.fieldCheckbox]: type === 'checkbox',
        [classes.fieldRange]: type === 'range',
      })}
    >
      <label
        htmlFor={name}
        className={classnames(classes.label, {
          [classes.labelCheckbox]: type === 'checkbox',
        })}
      >
        <span>
          {label}
          {description && (
            <small className={classes.description}>{description}</small>
          )}
        </span>
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
          {...(type === 'range' && { step: 5, min: 0, max: 100 })}
        />
      )}
      {type === 'range' && (
        <output className={classes.rangeOutput} htmlFor={name}>
          {(pertData as any)[name]}%
        </output>
      )}
    </div>
  );
};

export default Field;
