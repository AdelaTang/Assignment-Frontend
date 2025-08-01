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
      addListener: vi.fn(), // For legacy browser compatibility
      removeListener: vi.fn(), // For legacy browser compatibility
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock functions
const mockUpdateData = vi.fn();
const mockNextStep = vi.fn();
const mockPrevStep = vi.fn();

// Mock data
const mockData: RegistrationData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  gender: '',
  avatar: undefined
};

describe('AccountStep component test', () => {
  beforeEach(() => {
    // Reset mock functions
    mockUpdateData.mockClear();
    mockNextStep.mockClear();
    mockPrevStep.mockClear();
  });

  it('should render all form fields correctly', () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    expect(document.contains(screen.getByLabelText('Email'))).toBe(true);
    expect(document.contains(screen.getByLabelText('Password'))).toBe(true);
    expect(document.contains(screen.getByRole('button', { name: 'Previous' }))).toBe(true);
    expect(document.contains(screen.getByRole('button', { name: 'Next' }))).toBe(true);
  });

  it('should validate required fields', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Please input your email!'))).toBe(true);
        expect(document.contains(screen.getByText('Please input your password!'))).toBe(true);
    });
  });

  it('should validate email format', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Please enter a valid email'))).toBe(true);
    });
  });

  it('should validate password length', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
        expect(document.contains(screen.getByText('Password must be at least 8 characters'))).toBe(true);
    });
  });

  it('should call update function after filling form correctly', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'validPassword123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'validPassword123' } });
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'validPassword123',
        confirmPassword: 'validPassword123'
      });
      expect(mockNextStep).toHaveBeenCalled();
    });
  });

  it('should call prevStep when Previous button is clicked', () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('password input should toggle visibility', async () => {
    render(<AccountStep data={mockData} updateData={mockUpdateData} nextStep={mockNextStep} prevStep={mockPrevStep} />);

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = document.querySelector('.ant-input-password-icon')!;

    const type1 = passwordInput.type;

    // First click to toggle
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type === 'text' || passwordInput.type === 'password').toBe(true);
      expect(passwordInput.type).not.toBe(type1);
    });

    // Second click to toggle
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type === 'text' || passwordInput.type === 'password').toBe(true);
      expect(passwordInput.type).not.toBe(type1);
    });
  });
});

// Fix AntD Form test warning
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