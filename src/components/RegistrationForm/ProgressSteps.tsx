import { Steps } from 'antd';

const { Step } = Steps;

const stepTitles = ['Basic Info', 'Details', 'Account', 'Confirmation'];

const ProgressSteps: React.FC<{ current: number }> = ({ current }) => {
  return (
    <Steps current={current} aria-label="Registration steps" style={{ marginBottom: 32 }}>
      {stepTitles.map((title, index) => (
        <Step key={index} title={title} aria-current={index === current ? "step" : undefined} />
      ))}
    </Steps>
  );
};

export default ProgressSteps;