import { Card, Descriptions, Button, message } from 'antd';
import type { SpecificRegistrationStepProps } from '../../types/registration';
import { registerUser } from '../../api/mockApi';
import { useState } from 'react';

const ConfirmationStep: React.FC<SpecificRegistrationStepProps> = ({ data, prevStep }) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await registerUser(data as unknown as Record<string, unknown>);
      messageApi.success({
        content: 'Registration successful!',
        duration: 5,
      });
      console.log('Registration response:', response.data);
    } catch {
      messageApi.error({
        content: 'Registration failed. Please try again.',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}

      <Card title="Review Your Information" style={{ marginBottom: 24 }} bodyStyle={{ padding: 12 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="First Name">{data.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{data.lastName}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{data.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="Country">{data.country}</Descriptions.Item>
          <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        <Button style={{ width: '100%' }} onClick={prevStep}>Previous</Button>
        <Button style={{ width: '100%' }} type="primary" onClick={handleSubmit} loading={loading}>Submit Registration</Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;