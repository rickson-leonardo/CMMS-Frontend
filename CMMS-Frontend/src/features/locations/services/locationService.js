/**
 * @file locationService.js
 * @description Módulo de serviço para Localizações.
 */
import apiClient from '@/services/apiService';

const LOCATION_API_URL = '/api/locations/';

/**
 * Busca uma lista de Localizações.
 * @param {object} [params] - Parâmetros para filtro e paginação.
 * @returns {Promise<object>}
 */
export const fetchLocations = async (params = {}) => {
  try {
    const response = await apiClient.get(LOCATION_API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Localizações:', error);
    throw error;
  }
};

/**
 * Cria uma nova Localização.
 * @param {object} locationData - Dados da nova Localização.
 * @returns {Promise<object>}
 */
export const createLocation = async (locationData) => {
  try {
    const response = await apiClient.post(LOCATION_API_URL, locationData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar Localização:', error);
    throw error;
  }
};
