/**
 * @file mapService.js
 * @description Módulo de serviço para Mapas.
 */
import apiClient from '@/services/apiService';

const MAP_API_URL = '/api/maps/';

/**
 * Busca uma lista de Mapas.
 * @param {object} [params] - Parâmetros para filtro e paginação.
 * @returns {Promise<object>}
 */
export const fetchMaps = async (params = {}) => {
  try {
    const response = await apiClient.get(MAP_API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Mapas:', error);
    throw error;
  }
};

/**
 * Cria um novo Mapa.
 * @param {FormData} mapData - Dados do novo Mapa.
 * @returns {Promise<object>}
 */
export const createMap = async (mapData) => {
  try {
    const response = await apiClient.post(MAP_API_URL, mapData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar Mapa:', error);
    throw error;
  }
};
