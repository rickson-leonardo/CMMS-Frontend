/**
 * @file apiService.js
 * @version 1.0.0
 * @description Módulo central de configuração do Axios para o CMMS Frontend.
 *
 * @see {@link ../Arquitetura Frontend - Sistema CMMS.md} - Seção 6.0: Serviços e Lógica de Dados
 *
 * @copyright 2025 CMMS Pro. Todos os direitos reservados.
 *
 * @summary
 * Este arquivo exporta uma instância 'apiClient' do Axios pré-configurada.
 * É a fundação para todas as requisições HTTP ao backend.
 *
 * Principais Responsabilidades (conforme Arquitetura Frontend - Seção 6.1):
 * 1. Definir a `baseURL` padrão para todas as requisições (ex: '/api').
 * 2. Definir cabeçalhos padrão (`Content-Type: 'application/json'`).
 * 3. Implementar um Interceptador de Requisição (`request interceptor`) para:
 * - Buscar o token JWT (authToken) do `localStorage`.
 * - Anexar o token ao cabeçalho `Authorization` (Bearer Token) se ele existir.
 * 4. Implementar um Interceptador de Resposta (`response interceptor`) para:
 * - Lidar globalmente com erros 401 (Unauthorized): limpar o `localStorage` e
 * redirecionar o usuário para a tela de login (`/login`).
 * - Lidar com outros erros (5xx) de forma genérica.
 */

import axios from 'axios';

// 1. Criação da Instância Axios
// Conforme Seção 6.1.1 do documento de arquitetura.
const apiClient = axios.create({
  /**
   * A baseURL é configurada para '/api', permitindo que o proxy do Vite
   * (configurado em vite.config.js) redirecione as chamadas para o
   * backend Django em ambiente de desenvolvimento, evitando problemas de CORS.
   */
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptador de Requisição (Request Interceptor)
// Conforme Seção 6.1.1 do documento de arquitetura.
apiClient.interceptors.request.use(
  (config) => {
    /**
     * Busca o token de autenticação do localStorage em cada requisição.
     * A chave 'authToken' é o padrão definido na arquitetura.
     */
    const token = localStorage.getItem('authToken');

    if (token) {
      /**
       * Se o token existir, ele é anexado ao cabeçalho 'Authorization'.
       * O backend (Django REST Framework com SimpleJWT) espera o formato 'Bearer <token>'.
       */
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    /**
     * Trata erros que podem ocorrer *antes* da requisição ser enviada.
     */
    console.error('[API Service] Erro no interceptador de requisição:', error);
    return Promise.reject(error);
  }
);

// 3. Interceptador de Resposta (Response Interceptor)
// Conforme Seção 6.1.2 do documento de arquitetura.
apiClient.interceptors.response.use(
  (response) => {
    /**
     * Se a resposta for bem-sucedida (status 2xx), apenas a retorna.
     */
    return response;
  },
  (error) => {
    /**
     * Tratamento centralizado de erros de resposta da API.
     */
    const { response } = error;

    if (response) {
      // O servidor respondeu com um status de erro (4xx ou 5xx)

      if (response.status === 401) {
        /**
         * Erro 401 (Unauthorized): O token é inválido, expirou ou não foi fornecido.
         * Esta é a lógica de desautenticação global.
         */
        console.warn('[API Service] Erro 401 - Não Autorizado. Redirecionando para /login.');

        // 1. Remove o token inválido do localStorage.
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // Limpa também os dados do usuário, se houver.

        // 2. Redireciona para a página de login.
        // Usamos window.location para evitar problemas de dependência circular com o router.
        window.location.href = '/login';

        // Retorna uma promessa rejeitada para parar a cadeia de chamadas.
        return Promise.reject(new Error('Sessão expirada ou inválida.'));
      }

      if (response.status >= 500) {
        /**
         * Erro 5xx (Server Error): Erro interno no servidor.
         * Podemos exibir uma notificação global (Toast/Snackbar) aqui no futuro.
         */
        console.error(
          `[API Service] Erro ${response.status} - Erro Interno do Servidor:`,
          response.data
        );
      }
    } else if (error.request) {
      /**
       * A requisição foi feita, mas nenhuma resposta foi recebida.
       * (Ex: backend offline, problema de rede, CORS bloqueando).
       */
      console.error('[API Service] Erro de Rede ou Backend indisponível:', error.message);
    } else {
      /**
       * Um erro ocorreu ao configurar a requisição.
       */
      console.error('[API Service] Erro na configuração da requisição:', error.message);
    }

    // Propaga o erro para que os componentes (try/catch) possam tratá-lo localmente.
    return Promise.reject(error);
  }
);

/**
 * Exportação padrão da instância configurada do Axios.
 * Todos os outros módulos de serviço (ticketService, authService, etc.)
 * devem importar esta instância.
 *
 * @example
 * import apiClient from '@/services/apiService';
 *
 * export const getTickets = () => {
 * return apiClient.get('/tickets/');
 * };
 */
export default apiClient;
