import { useContext } from 'react';
import classnames from 'classnames';

import { IPertData, PertContextType } from '@/@types/pertData';
import { PertContext } from '@/context/pertContext';

import classes from './Field.module.css';

interface Props {
  label: string;
  description?: string;
  name: keyof Pick<
    IPertData,
    {
      [K in keyof IPertData]: IPertData[K] extends string | number | boolean
        ? K
        : never;
    }[keyof IPertData]
  >;
  type?: 'checkbox' | 'text' | 'select' | 'range';
  values?: string[];
  required?: boolean;
  disabled?: boolean;
}

const Field: React.FC<Props> = ({
  label,
  description,
  name,
  type = 'text',
  required = true,
  values,
  disabled = false,
}) => {
  const { pertData, updateField, isValidPertData } = useContext(
    PertContext
  ) as PertContextType;

  return (
    <div
      className={classnames(classes.field, {
        [classes.fieldCheckbox]: type === 'checkbox',
        [classes.fieldRange]: type === 'range',
        [classes.fieldDisabled]: disabled,
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
          value={pertData[name].toString()}
          onChange={updateField}
          required={required}
          {...(type === 'range' && { step: 5, min: 0, max: 100 })}
        />
      )}
      {type === 'range' && (
        <output className={classes.rangeOutput} htmlFor={name}>
          {pertData[name]}%
        </output>
      )}
    </div>
  );
};

export default Field;
