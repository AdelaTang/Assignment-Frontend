import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import AccountStep from '../AccountStep';
import type{ RegistrationData } from '../../../types/registration';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // 兼容旧浏览器
      removeListener: vi.fn(), // 兼容旧浏览器
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock 函数
const mockUpdateData = vi.fn();
const mockNextStep = vi.fn();
const mockPrevStep = vi.fn();

// Mock 数据
const mockData: RegistrationData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  gender: '',
  avatar: undefined
};

describe('AccountStep 组件测试', () => {
  beforeEach(() => {
    // 重置 mock 函数
    mockUpdateData.mockClear();
    mockNextStep.mockClear();
    mockPrevStep.mockClear();
  });

  it('应该正确渲染所有表单字段', () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    expect(document.contains(screen.getByLabelText('Email'))).toBe(true);
    expect(document.contains(screen.getByLabelText('Password'))).toBe(true);
    expect(document.contains(screen.getByRole('button', { name: 'Previous' }))).toBe(true);
    expect(document.contains(screen.getByRole('button', { name: 'Next' }))).toBe(true);
  });

  it('应该验证必填字段', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Please input your email!'))).toBe(true);
        expect(document.contains(screen.getByText('Please input your password!'))).toBe(true);
    });
  });

  it('应该验证邮箱格式', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Please enter a valid email'))).toBe(true);
    });
  });

  it('应该验证密码长度', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Password must be at least 8 characters'))).toBe(true);
    });
  });

  it('正确填写表单后应该调用更新函数', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'validPassword123' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'validPassword123'
      });
      expect(mockNextStep).toHaveBeenCalled();
    });
  });

  it('点击Previous按钮应该调用prevStep', () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('密码输入应该可以切换显示/隐藏', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
  
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
  
    // 找到切换按钮（Ant Design 使用眼睛图标）
    const toggleButton = document.querySelector('.ant-input-password-icon')!;
    
    // 默认应该是密码类型
    expect(passwordInput.type).toBe('password');
    
    // 点击切换显示
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('text');
    });
    
    // 再次点击切换隐藏
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('password');
    });
});
});

// 解决 AntD Form 测试警告
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    Form: {
      ...(actual as any).Form,
      useForm: () => [(actual as any).Form.useForm()[0], { scrollToField: vi.fn() }],
    },
  };
});