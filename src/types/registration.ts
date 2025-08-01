export interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  gender: string;
  avatar?: File;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface RegistrationStepProps {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export interface SpecificRegistrationStepProps {
  data: RegistrationData;
  updateData?: (newData: Partial<RegistrationData>) => void;
  nextStep?: () => void;
  prevStep?: () => void;
}

export interface RegistrationStepWithoutPreStepProps {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  nextStep: () => void;
}