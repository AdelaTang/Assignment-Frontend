import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import BasicInfoStep from '../BasicInfoStep';
import type { RegistrationData } from '../../../types/registration';

export const setAntdDatePicker = (container: Element, dateString: string) => {
  // Use a more reliable selector
  const input = container.querySelector<HTMLInputElement>('.ant-picker-input input');
  if (!input) {
    throw new Error('AntD DatePicker input not found. Please check if the correct selector is used.');
  }

  // Complete operation sequence
  fireEvent.focus(input);
  fireEvent.mouseDown(input);
  fireEvent.change(input, {
    target: {
      value: dateString,
      // These properties must be included
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

// Fix Ant Design matchMedia error
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

describe('BasicInfoStep component', () => {
  const mockUpdateData = vi.fn();
  const mockNextStep = vi.fn();

  it('should validate required fields', async () => {
    render(<BasicInfoStep data={mockFormData} updateData={mockUpdateData} nextStep={mockNextStep} />);

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(document.contains(screen.getByLabelText('First Name'))).toBe(true);
      expect(document.contains(screen.getByLabelText('Last Name'))).toBe(true);
      expect(document.contains(screen.getByLabelText('Date of Birth'))).toBe(true);
      expect(document.contains(screen.getByRole('button', { name: 'Next' }))).toBe(true);
    }, { timeout: 3000 });
  });

  it('should call update function after filling form correctly', async () => {
    render(<BasicInfoStep data={mockFormData} updateData={mockUpdateData} nextStep={mockNextStep} />);

    // Fill text fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });

    // Get DatePicker container (not the input itself)
    const datePicker = screen.getByLabelText('Date of Birth').closest('.ant-picker')!;
    setAntdDatePicker(datePicker, '1990-01-01');

    // Submit and verify
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
    }, { timeout: 5000 }); // Increase timeout
  });
});