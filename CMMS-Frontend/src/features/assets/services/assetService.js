import apiClient from '@/services/apiClient';

export const fetchAssets = (params = {}) => {
  return apiClient.get('/api/assets/', { params });
};
