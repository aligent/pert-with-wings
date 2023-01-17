import { MdSettings, MdClose } from 'react-icons/md';

import Field from '@/components/Field';

import classes from './AdvancedSettings.module.css';

interface Props {}

const AdvancedSettings: React.FC<Props> = () => {
  return (
    <details className={classes.advancedSettings}>
      <summary>
        <div className={classes.summaryLabel}>
          <MdSettings />
          Advanced Settings
          <span className={classes.close}>
            <MdClose />
          </span>
        </div>
      </summary>
      <section className={classes.content}>
        <Field
          label="Ticket specific communications Percentage"
          description="10% of dev task recommended."
          name="comms_percent"
          type="range"
        />
        <Field
          label="Code review & fixes Percentage"
          description="10% of dev task recommended."
          name="code_reviews_and_fixes_percent"
          type="range"
        />
        <Field
          label="Quality Assurance Testing Percentage"
          description="10% of dev task recommended."
          name="qa_testing_percent"
          type="range"
        />
        <Field
          label="Minimum Quality Assurance Estimate (minutes)"
          description="15 minutes recommended."
          name="qa_testing_min"
        />
        <Field
          label="Automated Tests Percentage"
          description="10% of dev task recommended."
          name="automated_tests_percent"
          type="range"
        />
        <Field
          label="Round to next minutes"
          description="10 recommended"
          name="round_to_next_minutes"
        />
      </section>
    </details>
  );
};

export default AdvancedSettings;
