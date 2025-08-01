import { Form, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RegistrationStepProps } from '../../types/registration';
import { countries } from '../../mockdata/countries';

const DetailsStep: React.FC<RegistrationStepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const [form] = Form.useForm();

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      // Clear selected files
      form.setFieldsValue({ avatar: [] });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = (values: any) => {
    updateData({
      country: values.country,
      gender: values.gender,
      avatar: values.avatar?.[0]?.originFileObj,
    });
    nextStep();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        country: data.country,
        gender: data.gender,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: 'Please select your country!' }]}
      >
        <Select showSearch placeholder="Select a country">
          {countries.map(country => (
            <Select.Option key={country.code} value={country.name}>
              {country.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select your gender!' }]}
      >
        <Select placeholder="Select a gender">
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
          <Select.Option value="other">Other</Select.Option>
          <Select.Option value="prefer-not-to-say">Prefer not to say</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Avatar"
        name="avatar"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      >
        <Upload
          aria-label="Upload avatar picture"
          name="avatar"
          listType="picture"
          beforeUpload={beforeUpload}
          maxCount={1}
          accept="image/jpeg,image/png"
          customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess("ok"), 0)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button style={{ flex: 1 }} onClick={prevStep}>Previous</Button>
        <Button type="primary" htmlType="submit" style={{ flex: 1 }}>Next</Button>
      </div>
    </Form>
  );
};

export default DetailsStep;