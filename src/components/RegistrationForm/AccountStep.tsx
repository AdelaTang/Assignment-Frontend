import { Form, Input, Button } from 'antd';
import type { RegistrationStepProps } from '../../types/registration';
import { validateEmail, validatePassword } from '../../utils/validation';

const AccountStep: React.FC<RegistrationStepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    updateData({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
    nextStep();
  };

  // Confirm password validation
  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject('Passwords do not match');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword || '',
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { validator: (_, value) => validateEmail(value) ? Promise.resolve() : Promise.reject('Please enter a valid email') }
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { validator: (_, value) => validatePassword(value) ? Promise.resolve() : Promise.reject('Password must be at least 8 characters') }
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          { validator: validateConfirmPassword }
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button style={{ flex: 1 }} onClick={prevStep}>Previous</Button>
        <Button type="primary" htmlType="submit" style={{ flex: 1 }}>Next</Button>
      </div>
    </Form>
  );
};

export default AccountStep;