import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
});

const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    // 处理文件（如 avatar）或普通字段
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const registerUser = async (data: any) => {
    if (import.meta.env.DEV) {
    console.log('Mock data:', data);
    return { data: { success: true } };
  }
  
  return api.post('/api/register', convertToFormData(data));
};