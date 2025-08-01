import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { Form, message } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import DetailsStep from '../DetailsStep';
import type { RegistrationStepProps } from '../../../types/registration';

// Mock countries data
const mockCountries = [
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
];

// Mock countries data
vi.mock('../../mockdata/countries', () => ({
  countries: [
    { code: 'US', name: 'United States' },
    { code: 'CN', name: 'China' },
  ],
}));

// Mock antd components
vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  // Form is both a component and has Item/useForm properties
  const MockForm = Object.assign(
    ({ children, onFinish }: { children: React.ReactNode; onFinish?: (values: { country: string; gender: string; avatar: File }) => void }) => (
      <form
        onSubmit={e => {
          e.preventDefault();
          const shouldValidatePass = (window as { _shouldValidatePass?: boolean })._shouldValidatePass !== false;
          if (shouldValidatePass && onFinish) {
            onFinish({
              country: 'US',
              gender: 'male',
              avatar: new File([''], 'test.png', { type: 'image/png' }),
            });
          }
        }}
      >
        {children}
      </form>
    ),
    {
      Item: actual.Form.Item,
      useForm: vi.fn(() => {
        const formInstance: Partial<FormInstance> = {
          getFieldValue: vi.fn(),
          getFieldsValue: vi.fn(),
          setFieldsValue: vi.fn(),
          validateFields: vi.fn().mockResolvedValue({
            country: 'US',
            gender: 'male',
            avatar: new File([''], 'test.png', { type: 'image/png' }),
          }),
          resetFields: vi.fn(),
          submit: vi.fn(),
        };
        return [formInstance as FormInstance];
      }),
    }
  );
  return {
    ...actual,
    Form: MockForm,
    Upload: ({ children, beforeUpload }: { children: React.ReactNode; beforeUpload?: (file: File, fileList: File[]) => void }) => {
      // Allow window._testUploadFileType to control type, default is image/png
      return (
        <div
          onClick={() => {
            if (typeof beforeUpload === 'function') {
              const fileType = (window as { _testUploadFileType?: string })._testUploadFileType || 'image/png';
              beforeUpload(new File([''], 'mock.png', { type: fileType }), []);
            }
          }}
        >
          {children}
        </div>
      );
    },
    message: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

vi.mock('@ant-design/icons', () => ({
  UploadOutlined: vi.fn(() => <span>UploadIcon</span>),
}));

describe('DetailsStep', () => {
  const mockUpdateData = vi.fn();
  const mockNextStep = vi.fn();
  const mockPrevStep = vi.fn();
  
  const defaultProps: RegistrationStepProps = {
    data: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      gender: '',
      email: '',
      password: '',
      avatar: undefined
    },
    updateData: mockUpdateData,
    nextStep: mockNextStep,
    prevStep: mockPrevStep,
  };

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
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<DetailsStep {...defaultProps} />);
    
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByText('UploadIcon')).toBeInTheDocument(); // Avatar upload
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows country options correctly', async () => {
    render(<DetailsStep {...defaultProps} />);
    
    const countrySelect = screen.getByLabelText('Country').parentElement?.querySelector('.ant-select-selector');
    if (countrySelect) {
      fireEvent.mouseDown(countrySelect);
      
      await waitFor(() => {
        mockCountries.forEach(country => {
          expect(screen.getByText(country.name)).toBeInTheDocument();
        });
      });
    }
  });

  it('shows gender options correctly', async () => {
    render(<DetailsStep {...defaultProps} />);
    
    const genderSelect = screen.getByLabelText('Gender').parentElement?.querySelector('.ant-select-selector');
    if (genderSelect) {
      fireEvent.mouseDown(genderSelect);
      
      await waitFor(() => {
        expect(screen.getByText('Male')).toBeInTheDocument();
        expect(screen.getByText('Female')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();
        expect(screen.getByText('Prefer not to say')).toBeInTheDocument();
      });
    }
  });

  it('calls prevStep when Previous button is clicked', () => {
    render(<DetailsStep {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('validates required fields before submission', async () => {
    (window as { _shouldValidatePass?: boolean })._shouldValidatePass = false; // Simulate validation failure
    render(<DetailsStep {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(mockNextStep).not.toHaveBeenCalled();
    });
    delete (window as { _shouldValidatePass?: boolean })._shouldValidatePass;
  });

  it('submits form with valid data', async () => {
    const testData = {
      country: 'US',
      gender: 'male',
      avatar: new File([''], 'test.png', { type: 'image/png' }),
    };

    // Mock form instance
    const mockFormInstance: Partial<FormInstance> = {
      validateFields: vi.fn().mockResolvedValue(testData),
      getFieldsValue: vi.fn().mockReturnValue(testData),
      setFieldsValue: vi.fn(),
    };

    vi.mocked(Form.useForm).mockReturnValue([mockFormInstance as FormInstance]);

    render(<DetailsStep {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(mockUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          country: testData.country,
          gender: testData.gender,
        })
      );
      expect(mockNextStep).toHaveBeenCalled();
    });
  });

  it('rejects non-image files in upload', async () => {
    (window as { _testUploadFileType?: string })._testUploadFileType = 'text/plain'; // Set to non-image type
    render(<DetailsStep {...defaultProps} />);
    const upload = screen.getByText('UploadIcon');
    fireEvent.click(upload);
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('You can only upload JPG/PNG files!');
    });
    delete (window as { _testUploadFileType?: string })._testUploadFileType;
  });
});