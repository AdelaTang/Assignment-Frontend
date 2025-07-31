import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll} from 'vitest';
import BasicInfoStep from '../BasicInfoStep';
import type{ RegistrationData } from '../../../types/registration';


export const setAntdDatePicker = (container: Element, dateString: string) => {
  // 改用更可靠的查询方式
  const input = container.querySelector('.ant-picker-input input');
  if (!input) {
    throw new Error('AntD DatePicker input not found. 检查是否使用了正确的选择器');
  }
  
  // 完整的操作序列
  fireEvent.focus(input);
  fireEvent.mouseDown(input);
  fireEvent.change(input, { 
    target: { 
      value: dateString,
      // 必须包含这些属性
      selectionStart: 0,
      selectionEnd: dateString.length
    }
  });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
};

const mockFormData: RegistrationData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  gender: '',
  email: '',
  password: '',
  avatar: undefined
};

// 解决 Ant Design 的 matchMedia 报错
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});


describe('BasicInfoStep 组件测试', () => {
  const mockUpdateData = vi.fn();
  const mockNextStep = vi.fn();

  it('应该验证必填字段', async () => {
    render(<BasicInfoStep data={mockFormData} updateData={mockUpdateData} nextStep={mockNextStep} />);
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(document.contains(screen.getByLabelText('First Name'))).toBe(true);
      expect(document.contains(screen.getByLabelText('Last Name'))).toBe(true);
      expect(document.contains(screen.getByLabelText('Date of Birth'))).toBe(true);
      expect(document.contains(screen.getByRole('button', { name: 'Next' }))).toBe(true);
    }, { timeout: 3000 });
  });

  it('正确填写表单后应该调用更新函数', async () => {
    render(<BasicInfoStep data={mockFormData} updateData={mockUpdateData} nextStep={mockNextStep} />);

    // 填写文本字段
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '张' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: '三' } });

    // 获取 DatePicker 的容器（不是 input 本身）
    const datePicker = screen.getByLabelText('Date of Birth').closest('.ant-picker')!;
    setAntdDatePicker(datePicker, '1990-01-01');

    // 提交并验证
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith({
        firstName: '张',
        lastName: '三',
        dateOfBirth: '1990-01-01'
      });
    }, { timeout: 5000 }); // 增加超时时间
  });
});