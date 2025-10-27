/**
 * @file authService.js
 * @version 1.0.0
 * @description Módulo de serviço para lidar com autenticação (login, logout, perfil).
 *
 * @see {@link ../../../Arquitetura Frontend - Sistema CMMS.md} - Seção 6.2: Padrão de Módulo de Serviço Específico
 * @see {@link ../../../all-api-urls.py} - (Endpoints inferidos: /api/auth/token/, /api/users/me/)
 * @see {@link ../../../all-api-serializers.py} - (Serializers: TokenObtainPairSerializer, UserSerializer)
 *
 * @copyright 2025 CMMS Pro. Todos os direitos reservados.
 *
 * @summary
 * Este arquivo encapsula a lógica de comunicação com a API de autenticação.
 * Ele importa o 'apiClient' central e é responsável por:
 * 1. Enviar credenciais de login.
 * 2. Salvar/Remover o token JWT e os dados do usuário do localStorage.
 * 3. Buscar os dados do perfil do usuário autenticado.
 */

import apiClient from '@/services/apiService'; // Importa o apiClient central

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - O email do usuário.
 * @property {string} password - A senha do usuário.
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access - O token de acesso JWT.
 * @property {string} refresh - O token de refresh JWT.
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - O UUID do usuário.
 * @property {string} email - O email do usuário.
 * @property {string} full_name - O nome completo do usuário.
 * @property {string} role - O nível de permissão (admin, manager, technician, requester).
 */

/**
 * Realiza a autenticação do usuário na API.
 * Em caso de sucesso, armazena o token de acesso no localStorage
 * e retorna os dados da resposta (access, refresh).
 *
 * @param {LoginCredentials} credentials - O objeto contendo email e password.
 * @returns {Promise<AuthResponse>} A resposta da API contendo os tokens.
 * @throws {Error} Lança um erro se a autenticação falhar.
 */
export const login = async (credentials) => {
  try {
    // 1. Faz a requisição POST para o endpoint de obtenção de token.
    // Conforme padrão SimpleJWT (/api/auth/token/).
    const response = await apiClient.post('/auth/token/', credentials);

    const { access, refresh } = response.data;

    // 2. Verifica se o token de acesso foi recebido.
    if (access) {
      // 3. Armazena o token de acesso no localStorage.
      // A chave 'authToken' é o padrão esperado pelo 'apiService.js'.
      localStorage.setItem('authToken', access);

      // Opcional: armazenar o token de refresh se a lógica de refresh for implementada.
      localStorage.setItem('refreshToken', refresh);
    }

    // 4. Retorna a resposta completa para o componente (ex: LoginView.vue).
    return response.data;
  } catch (error) {
    console.error('[Auth Service] Erro durante o login:', error.response?.data || error.message);
    // Propaga o erro para o componente (ex: LoginView) poder tratá-lo.
    throw error;
  }
};

/**
 * Busca os dados do perfil do usuário autenticado.
 * Em caso de sucesso, armazena o perfil no localStorage.
 *
 * @returns {Promise<UserProfile>} O objeto de perfil do usuário.
 * @throws {Error} Lança um erro se a busca falhar (ex: 401).
 */
export const fetchUserProfile = async () => {
  try {
    // 1. Faz a requisição GET para o endpoint de perfil.
    // (Ex: /api/users/me/)
    const response = await apiClient.get('/users/me/');

    const userProfile = response.data;

    // 2. Armazena os dados do usuário no localStorage para acesso rápido.
    // Conforme UserSerializer (id, email, full_name, role).
    localStorage.setItem('user', JSON.stringify(userProfile));

    // 3. Retorna o perfil para o chamador (ex: App.vue ou um store).
    return userProfile;
  } catch (error) {
    console.error('[Auth Service] Erro ao buscar perfil do usuário:', error.response?.data || error.message);
    // O interceptador em 'apiService.js' já cuidará do 401 (redirecionamento),
    // mas propagamos o erro mesmo assim.
    throw error;
  }
};

/**
 * Realiza o logout do usuário, limpando o localStorage.
 * O redirecionamento é geralmente feito pelo componente/router após
 * chamar esta função.
 */
export const logout = () => {
  console.log('[Auth Service] Realizando logout.');
  // 1. Remove os dados de sessão do localStorage.
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  // 2. (Opcional) Informa o backend sobre o logout (blacklist token).
  // try {
  //   await apiClient.post('/auth/logout/', {
  //     refresh: localStorage.getItem('refreshToken'),
  //   });
  // } catch (error) {
  //   console.warn('[Auth Service] Falha ao invalidar token no backend:', error);
  // }
};
