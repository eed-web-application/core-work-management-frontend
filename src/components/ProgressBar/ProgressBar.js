import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentStatus }) => {
  const steps = [
    'Created',
    'Assigned Personnel',
    'Job Created',
    'Pending Paperwork',
    'Pending Approval',
    'Ready for Work',
    'Work in Progress',
    'Work Complete',
    'Issue Resolved'
  ];

  const getStepClass = (step) => {
    const stepIndex = steps.indexOf(step);
    const currentStepIndex = steps.indexOf(currentStatus);

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active active-underline';
    return 'pending';
  };

  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div key={index} className={`progress-step ${getStepClass(step)}`}>
          <span className="step-name">{step}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
