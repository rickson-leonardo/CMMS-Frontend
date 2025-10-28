/**
 * @file workOrderService.js
 * @description Módulo de serviço para Ordens de Serviço.
 */
import apiClient from '@/services/apiService';

const WORK_ORDER_API_URL = '/api/work-orders/';

/**
 * Busca uma lista de Ordens de Serviço.
 * @param {object} [params] - Parâmetros para filtro e paginação.
 * @returns {Promise<object>}
 */
export const fetchWorkOrders = async (params = {}) => {
  try {
    const response = await apiClient.get(WORK_ORDER_API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar Ordens de Serviço:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma Ordem de Serviço pelo ID.
 * @param {string} workOrderId - O UUID da Ordem de Serviço.
 * @returns {Promise<object>}
 */
export const getWorkOrderById = async (workOrderId) => {
  try {
    const response = await apiClient.get(`${WORK_ORDER_API_URL}${workOrderId}/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar Ordem de Serviço ${workOrderId}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova Ordem de Serviço.
 * @param {object} workOrderData - Dados da nova Ordem de Serviço.
 * @returns {Promise<object>}
 */
export const createWorkOrder = async (workOrderData) => {
  try {
    const response = await apiClient.post(WORK_ORDER_API_URL, workOrderData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar Ordem de Serviço:', error);
    throw error;
  }
};
