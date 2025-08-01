import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
});

const convertToFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Handle files (such as avatar) or normal fields
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};

export const registerUser = async (data: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
    console.log('Mock data:', data);
    return { data: { success: true } };
  }

  return api.post('/api/register', convertToFormData(data));
};