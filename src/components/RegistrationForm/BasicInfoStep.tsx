import { Form, Input, DatePicker, Button } from 'antd';
import type { RegistrationStepWithoutPreStepProps } from '../../types/registration';
import dayjs from 'dayjs';
import { validateRequired, validateDateOfBirth } from '../../utils/validation';

const BasicInfoStep: React.FC<RegistrationStepWithoutPreStepProps> = ({ data, updateData, nextStep }) => {
  const [form] = Form.useForm();

  const onFinish = (values: { firstName: string; lastName: string; dateOfBirth: dayjs.Dayjs }) => {
    updateData({
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
    });
    nextStep();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
      }}
      onFinish={onFinish}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          { required: true, message: 'Please input your first name!' },
          { validator: (_, value) => validateRequired(value) ? Promise.resolve() : Promise.reject('First name is required') }
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          { required: true, message: 'Please input your last name!' },
          { validator: (_, value) => validateRequired(value) ? Promise.resolve() : Promise.reject('Last name is required') }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[
          { required: true, message: 'Please select your date of birth!' },
          { validator: (_, value) => 
            value && validateDateOfBirth(value.format('YYYY-MM-DD')) 
              ? Promise.resolve() 
              : Promise.reject('Date of birth must be in the past') 
          }
        ]}
      >
        <DatePicker style={{ width: '100%' }} 
            aria-label="Select date of birth"
            placeholder="YYYY-MM-DD"/>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>Next</Button>
      </Form.Item>
    </Form>
  );
};

export default BasicInfoStep;