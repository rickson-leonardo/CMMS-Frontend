/**
 * @file LoginView.vue
 * @version 1.2.0
 * @description View principal para a funcionalidade de autenticação (Login).
 * Conecta-se ao authService para autenticar o usuário e redirecioná-lo.
 * @path src/features/auth/LoginView.vue
 * @date 2025-10-24
 *
 * @see {@link ./services/authService.js} - Importa a lógica de autenticação.
 * @see {@link ../../Arquitetura Frontend - Sistema CMMS.md} - Seção 4.0 (Componentes Vue)
 */

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">CMMS Pro</h1>
      <p class="login-subtitle">Acesse sua conta</p>

      <!-- Mensagem de Erro -->
      <div v_if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Formulário de Login -->
      <form @submit.prevent="handleLogin">
        <!-- Campo de Email -->
        <div class="form-group">
          <BaseInput
            v-model="email"
            type="email"
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            id="login-email"
            :disabled="isLoading"
            required
          >
            <!-- Ícone (conforme BEM, mas o <slot> é mais simples) -->
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-fill icon" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.558z"/>
              </svg>
            </template>
          </BaseInput>
        </div>

        <!-- Campo de Senha -->
        <div class="form-group">
          <BaseInput
            v-model="password"
            type="password"
            label="Senha"
            placeholder="Sua senha"
            id="login-password"
            :disabled="isLoading"
            required
          >
            <!-- Ícone -->
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill icon" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
              </svg>
            </template>
          </BaseInput>
        </div>

        <!-- Botão de Entrar -->
        <div class="form-group">
          <BaseButton
            type="submit"
            label="Entrar"
            :loading="isLoading"
            :disabled="isLoading"
            variant="primary"
            class="button--full-width"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, fetchUserProfile } from '@/features/auth/services/authService.js';

// Importa os componentes de base (conforme Arquitetura - Seção 4.2)
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

// --- Reatividade ---

const router = useRouter();

// Conforme Seção 5.2: Estado reativo local
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);

// --- Métodos ---

/**
 * Lida com a submissão do formulário de login.
 * Chama o authService, trata a resposta e redireciona.
 */
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // 1. Chama o serviço de login
    // A estrutura { email: email.value, ... } corresponde ao TokenObtainPairSerializer
    await login({
      email: email.value,
      password: password.value,
    });

    // 2. Se o login for bem-sucedido, busca os dados do usuário
    // O authService.js salvará os dados no localStorage
    await fetchUserProfile();

    // 3. Redireciona para o dashboard (ou página principal)
    // Conforme Seção 7.0 (Roteamento)
    router.push('/dashboard');

  } catch (error) {
    // 4. Trata erros de login
    // O interceptador 401 em apiService.js já trata tokens expirados,
    // este 'catch' trata especificamente de credenciais inválidas (ex: 400 Bad Request).
    console.error('[LoginView] Falha no login:', error);
    errorMessage.value = 'E-mail ou senha inválidos. Tente novamente.';
  } finally {
    // 5. Garante que o loading seja desativado
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos BEM (Block Element Modifier) conforme Arquitetura - Seção 3.2 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  box-sizing: border-box; /* Ajustado para considerar padding se houver */
  padding: var(--spacing-6);
  background-color: var(--color-background-page); /* Garante fundo consistente */
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-8);
  background-color: var(--color-background-surface);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-lg);
}

.login-title {
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-default);
  margin-bottom: var(--spacing-2);
}

.login-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-6);
}

.form-group {
  margin-bottom: var(--spacing-4); /* Aumenta o espaçamento entre os inputs */
}

/* Garante que o ícone dentro do BaseInput tenha a cor correta */
.form-group .icon {
   color: var(--color-text-muted);
   margin-right: var(--spacing-2);
}

.error-message {
  background-color: var(--color-red-50);
  color: var(--color-red-700);
  border: 1px solid var(--color-red-200);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-sm);
  text-align: center;
}

/* Modificador BEM para o botão de largura total */
.button--full-width {
  width: 100%;
}
</style>
