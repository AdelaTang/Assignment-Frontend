import { Card, Descriptions, Button, message, Space } from 'antd';
import type { SpecificRegistrationStepProps } from '../../types/registration';
import { registerUser } from '../../api/mockApi';
import { useState } from 'react';

const ConfirmationStep: React.FC<SpecificRegistrationStepProps> = ({ data, prevStep }) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      messageApi.success({
        content: 'Registration successful!',
        duration: 5,
      });
      console.log('Registration response:', response.data);
    } catch (error) {
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

      <Card title="Review Your Information" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="First Name">{data.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{data.lastName}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{data.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="Country">{data.country}</Descriptions.Item>
          <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
          <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Space size="large">
        <Button onClick={prevStep}>Previous</Button>
        <Button type="primary" onClick={handleSubmit} loading={loading}>Submit Registration</Button>
      </Space>
    </div>
  );
};

export default ConfirmationStep;