/**
 * @file App.vue
 * @version 1.0.0
 * @description Componente raiz da aplicação CMMS Pro.
 * É responsável por renderizar o layout apropriado (Login vs. App Principal)
 * e por verificar a sessão do usuário ao carregar.
 * @path src/App.vue
 * @date 2025-10-24
 *
 * @see {@link ./Arquitetura Frontend - Sistema CMMS.md} - Seção 4.0 (Componentes Vue)
 * @see {@link ./features/auth/services/authService.js} - Importa a lógica de verificação de perfil.
 */

<template>
  <!-- Renderização condicional do Layout -->
  
  <!-- Se for a rota de login, renderiza a view diretamente -->
  <router-view v-if="isLoginRoute" />

  <!-- Para todas as outras rotas, usa o MainLayout -->
  <MainLayout v-else>
    <router-view />
  </MainLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchUserProfile } from '@/features/auth/services/authService.js';

// --- Lógica de Layout ---

const route = useRoute();

/**
 * Verifica se a rota atual é a de login.
 * Isso é usado para desabilitar o MainLayout (Sidebar, Header) na tela de login.
 * Conforme Seção 7.0 (Roteamento) da arquitetura.
 */
const isLoginRoute = computed(() => route.path === '/login');

// --- Lógica de Verificação de Sessão ---

/**
 * Ao carregar a aplicação, verifica se o usuário já tem uma sessão válida.
 */
onMounted(async () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  // Se temos um token, mas não temos os dados do usuário (ex: F5, recarregamento da página),
  // buscamos os dados do usuário para reidratar a sessão.
  if (token && !user) {
    try {
      console.log('[App.vue] Token encontrado. Buscando perfil do usuário...');
      await fetchUserProfile();
      console.log('[App.vue] Perfil do usuário carregado com sucesso.');
    } catch (error) {
      // O erro 401 (token inválido/expirado) já é tratado pelo interceptador
      // em apiService.js, que redirecionará para /login.
      console.error('[App.vue] Falha ao buscar perfil com token existente:', error.message);
    }
  } else if (!token && !isLoginRoute.value) {
    // Se não há token e não estamos na página de login, o router (ou o
    // interceptor 401) deve ter nos redirecionado.
    // Esta lógica é uma garantia, mas as guardas de rota (em router/index.js)
    // são o local ideal para forçar o redirecionamento.
    console.warn('[App.vue] Sem token. Acesso negado (esperando redirecionamento do router/API).');
  }
});
</script>

<style>
/* * O style.css global já deve ter sido importado em main.js.
 * Este <style> é 'scoped' por padrão se 'scoped' for adicionado,
 * ou global se não. Deixaremos sem 'scoped' se quisermos
 * aplicar estilos globais, mas o ideal é usar o style.css.
 * * Para este componente raiz, não são necessários estilos específicos.
 */
</style>
