/**
 * @file ticketService.js
 * @version 1.0.0
 * @description Módulo de serviço para interagir com a API de Tickets.
 * Encapsula todas as chamadas HTTP relacionadas a tickets,
 * seguindo o padrão da Seção 6.2 da Arquitetura.
 *
 * @see {@link ../../../Arquitetura Frontend - Sistema CMMS.md} - Seção 6.2
 * @see {@link ../../../services/apiService.js} - Importa o cliente API central.
 * @see {@link ../../../../backend-docs/all-api-urls.py} - Endpoints da API de Tickets.
 * @see {@link ../../../../backend-docs/all-api-serializers.py} - Serializers de Ticket.
 * @path src/features/tickets/services/ticketService.js
 * @date 2025-10-24
 */

import apiClient from '@/services/apiService.js';

// --- Constantes (Endpoints) ---

const TICKET_API_URL = '/api/tickets/';

// --- Funções do Serviço ---

/**
 * Busca uma lista paginada de tickets do backend.
 * A resposta da API corresponde ao 'TicketSerializer' (lista).
 *
 * @param {object} [params] - Parâmetros de consulta (query params) para filtragem, ordenação ou paginação.
 * @returns {Promise<object>} Uma promessa que resolve para a resposta da API (ex: { count, next, previous, results: [...] }).
 * @throws {Error} Lança um erro se a requisição da API falhar.
 */
export const fetchTickets = async (params = {}) => {
  try {
    console.log('[ticketService] Fetching tickets com params:', params);
    const response = await apiClient.get(TICKET_API_URL, { params });
    return response.data;
  } catch (error) {
    console.error(`[ticketService] Erro ao buscar tickets:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Busca os detalhes completos de um único ticket pelo seu ID.
 * A resposta da API corresponde ao 'TicketSerializer' (detalhe).
 *
 * @param {string} ticketId - O UUID do ticket a ser buscado.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto do ticket.
 * @throws {Error} Lança um erro se a requisição da API falhar (ex: 404).
 */
export const getTicketById = async (ticketId) => {
  if (!ticketId) {
    throw new Error('[ticketService] getTicketById: ID do ticket é obrigatório.');
  }
  try {
    const url = `${TICKET_API_URL}${ticketId}/`;
    console.log(`[ticketService] Buscando ticket por ID: ${ticketId}`);
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(`[ticketService] Erro ao buscar ticket ${ticketId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cria um novo ticket no sistema.
 * O payload (ticketData) deve corresponder ao 'TicketCreateSerializer'.
 * Mapeia o campo `assetId` do formulário para `asset_id` da API.
 *
 * @param {object} ticketData - Os dados para o novo ticket.
 * @param {string} ticketData.title - Título do ticket.
 * @param {string} ticketData.description - Descrição detalhada do problema.
 * @param {string} [ticketData.assetId] - (Opcional) O UUID do ativo relacionado.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto do novo ticket criado.
 * @throws {Error} Lança um erro se a requisição da API falhar.
 */
export const createTicket = async (ticketData) => {
  if (!ticketData || !ticketData.title || !ticketData.description) {
    throw new Error('[ticketService] createTicket: Título e Descrição são obrigatórios.');
  }
  try {
    // Mapeia o campo assetId (do formulário) para asset_id (esperado pela API)
    const payload = { ...ticketData };
    if (payload.assetId) {
      payload.asset_id = payload.assetId;
      delete payload.assetId;
    }

    console.log('[ticketService] Criando novo ticket com payload:', payload);
    const response = await apiClient.post(TICKET_API_URL, payload);
    return response.data;
  } catch (error) {
    console.error(`[ticketService] Erro ao criar ticket:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Atualiza um ticket existente no sistema.
 * O payload (ticketData) deve corresponder ao 'TicketCreateSerializer' (parcial).
 * Mapeia o campo `assetId` do formulário para `asset_id` da API.
 *
 * @param {string} ticketId - O UUID do ticket a ser atualizado.
 * @param {object} ticketData - Os dados a serem atualizados.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto do ticket atualizado.
 * @throws {Error} Lança um erro se a requisição da API falhar.
 */
export const updateTicket = async (ticketId, ticketData) => {
  if (!ticketId) {
    throw new Error('[ticketService] updateTicket: ID do ticket é obrigatório.');
  }
  try {
    // Mapeia o campo assetId (do formulário) para asset_id (esperado pela API)
    const payload = { ...ticketData };
    if (payload.assetId) {
      payload.asset_id = payload.assetId;
      delete payload.assetId;
    }

    const url = `${TICKET_API_URL}${ticketId}/`;
    console.log(`[ticketService] Atualizando ticket ${ticketId} com payload:`, payload);
    const response = await apiClient.patch(url, payload);
    return response.data;
  } catch (error) {
    console.error(`[ticketService] Erro ao atualizar ticket ${ticketId}:`, error.response?.data || error.message);
    throw error;
  }
};
