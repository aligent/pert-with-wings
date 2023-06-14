import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdSettings } from 'react-icons/md';

import { PertContextType } from '@/@types/pertData';
import Field from '@/components/Field';
import { PertContext } from '@/context/pertContext';

import classes from './AdvancedSettings.module.css';

const AdvancedSettings: FC = () => {
  const { pertData } = useContext(PertContext) as PertContextType;
  const { t } = useTranslation();
  const hasQaEstimate = pertData.pertRows.some((row) => row.isQATask);
  return (
    <details className={classes.advancedSettings}>
      <summary className={classes.summary}>
        <div className={classes.summaryLabel}>
          <MdSettings />
          {t('advancedSettings')}
          <span className={classes.close}>
            <MdClose />
          </span>
        </div>
      </summary>
      <section className={classes.content}>
        <Field
          label="Ticket specific communications Percentage"
          description={`10% of dev ${t('task')} recommended.`}
          name="comms_percent"
          type="range"
        />
        <Field
          label="Code review & fixes Percentage"
          description={`10% of dev ${t('task')} recommended.`}
          name="code_reviews_and_fixes_percent"
          type="range"
        />
        <Field
          label="Quality Assurance Testing Percentage"
          description={`10% of dev ${t('task')} recommended.`}
          name="qa_testing_percent"
          type="range"
          disabled={hasQaEstimate}
        />
        <Field
          label="Minimum Quality Assurance Estimate (minutes)"
          description="15 minutes recommended."
          name="qa_testing_min"
          disabled={hasQaEstimate || pertData.qa_testing_percent === 0}
        />
        <Field
          label="Automated Tests Percentage"
          description={`10% of dev ${t('task')} recommended.`}
          name="automated_tests_percent"
          type="range"
          disabled={!pertData.automatedTests}
        />
        {/* <Field
          label="Round to next minutes"
          description="10 recommended"
          name="round_to_next_minutes"
        /> */}
      </section>
    </details>
  );
};

export default AdvancedSettings;
