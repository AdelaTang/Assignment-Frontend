import { useState } from 'react';
import { Card } from 'antd';
import BasicInfoStep from './BasicInfoStep';
import DetailsStep from './DetailsStep';
import AccountStep from './AccountStep';
import ConfirmationStep from './ConfirmationStep';
import ProgressSteps from './ProgressSteps';
import type{ RegistrationData } from '../../types/registration';
import { Flex, Grid } from 'antd';
import type { CSSProperties } from 'react';

const { useBreakpoint } = Grid;

type ResponsiveStyle = CSSProperties & {
  '@media (min-width: 576px)'?: CSSProperties;
};

const RegistrationForm = () => {
    const screens = useBreakpoint();
    const formStyles: ResponsiveStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '16px',
        width: '100%'
    };
    
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    gender: '',
    email: '',
    password: '',
  });

  const updateData = (newData: Partial<RegistrationData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const steps = [
    <BasicInfoStep data={formData} updateData={updateData} nextStep={nextStep} />,
    <DetailsStep data={formData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />,
    <AccountStep data={formData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />,
    <ConfirmationStep data={formData} prevStep={prevStep} />,
  ];

  return (
    <Flex vertical style={formStyles as CSSProperties}>
        <Card
          style={{
            width: '100%',
            maxWidth: 1000,
            margin: '0 auto',
            padding: screens.sm ? '24px' : '16px',
            borderRadius: 0,
            boxShadow: screens.sm ? '0 2px 16px rgba(0,0,0,0.08)' : undefined,
          }}
        >
            <ProgressSteps current={currentStep} />
                {steps[currentStep]}
        </Card>
    </Flex>
  );

};

export default RegistrationForm;