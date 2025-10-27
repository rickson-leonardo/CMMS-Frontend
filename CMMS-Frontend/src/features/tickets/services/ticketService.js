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
 *
 * @param {object} ticketData - Os dados para o novo ticket.
 * @param {string} ticketData.title - Título do ticket.
 * @param {string} ticketData.description - Descrição detalhada do problema.
 * @param {string} [ticketData.asset_id] - (Opcional) O UUID do ativo relacionado.
 * @returns {Promise<object>} Uma promessa que resolve para o objeto do novo ticket criado.
 * @throws {Error} Lança um erro se a requisição da API falhar (ex: 400 Bad Request).
 */
export const createTicket = async (ticketData) => {
  if (!ticketData || !ticketData.title || !ticketData.description) {
    throw new Error('[ticketService] createTicket: Título e Descrição são obrigatórios.');
  }
  try {
    console.log('[ticketService] Criando novo ticket com dados:', ticketData);
    // A API espera: { title, description, asset_id (opcional) }
    const response = await apiClient.post(TICKET_API_URL, ticketData);
    return response.data;
  } catch (error) {
    console.error(`[ticketService] Erro ao criar ticket:`, error.response?.data || error.message);
    throw error;
  }
};
