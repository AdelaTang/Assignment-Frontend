import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import ConfirmationStep from '../ConfirmationStep';
import type { RegistrationData } from '../../../types/registration';
import { message } from 'antd';
import * as api from '../../../api/mockApi';

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

// Mock the antd message
vi.mock('antd', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('antd');
    return {
        ...actual,
        message: {
            useMessage: vi.fn(() => [vi.fn(), { contextHolder: <div /> }]),
        },
    };
});

// Mock the registerUser API
vi.mock('../../api/mockApi', () => ({
    registerUser: vi.fn(),
}));

describe('ConfirmationStep', () => {
    const mockPrevStep = vi.fn();
    const mockData: RegistrationData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        country: 'USA',
        gender: 'Male',
        email: 'john.doe@example.com',
        password: '1234567890'
    };

    const mockMessageApi = {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        loading: vi.fn(),
        open: vi.fn(),
        destroy: vi.fn(),
    };

    beforeAll(() => {
        vi.spyOn(message, 'useMessage').mockReturnValue([
            mockMessageApi,
            <div data-testid="message-context" key="message-context" />,
        ]);
    });

    it('renders all user information correctly', () => {
        render(<ConfirmationStep data={mockData} prevStep={mockPrevStep} />);

        expect(screen.getByText('Review Your Information')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText(mockData.firstName)).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText(mockData.lastName)).toBeInTheDocument();
        expect(screen.getByText('Date of Birth')).toBeInTheDocument();
        expect(screen.getByText(mockData.dateOfBirth)).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();
        expect(screen.getByText(mockData.country)).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();
        expect(screen.getByText(mockData.gender)).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText(mockData.email)).toBeInTheDocument();
    });

    it('renders Previous and Submit Registration buttons', () => {
        render(<ConfirmationStep data={mockData} prevStep={mockPrevStep} />);

        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Submit Registration')).toBeInTheDocument();
    });

    it('calls prevStep when Previous button is clicked', () => {
        render(<ConfirmationStep data={mockData} prevStep={mockPrevStep} />);

        fireEvent.click(screen.getByText('Previous'));
        expect(mockPrevStep).toHaveBeenCalled();
    });

    it('handles successful form submission', async () => {
        const mockRegisterUser = vi.fn().mockResolvedValue({ data: { success: true } });
        vi.spyOn(api, 'registerUser').mockImplementation(mockRegisterUser);

        render(<ConfirmationStep data={mockData} prevStep={mockPrevStep} />);

        const submitButton = screen.getByRole('button', { name: /submit registration/i });
        fireEvent.click(submitButton);

        // Only check loading class, not aria-disabled
        expect(submitButton).toHaveClass('ant-btn-loading');

        await waitFor(() => {
            expect(api.registerUser).toHaveBeenCalledWith(mockData);
            expect(submitButton).not.toHaveClass('ant-btn-loading');
        });
    });

    it('shows loading state during submission', async () => {
        const mockRegisterUser = vi.fn().mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 500))
        );
        vi.spyOn(api, 'registerUser').mockImplementation(mockRegisterUser);

        render(<ConfirmationStep data={mockData} prevStep={mockPrevStep} />);

        fireEvent.click(screen.getByText('Submit Registration'));

        expect(screen.getByText('Submit Registration').closest('button')).toHaveClass('ant-btn-loading');

        await waitFor(() => {
            expect(screen.getByText('Submit Registration').closest('button')).not.toHaveClass('ant-btn-loading');
        });
    });
});