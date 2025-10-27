<template>
  <div class="not-found-view">
    <div class="not-found-view__content">
      <span class="not-found-view__error-code">404</span>
      <h1 class="not-found-view__title">Página Não Encontrada</h1>
      <p class="not-found-view__message">
        Desculpe, o recurso que você está procurando não existe ou foi movido.
      </p>
      
      <router-link to="/dashboard" class="not-found-view__action">
        Voltar para o Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
/**
 * Script (Composition API)
 *
 * Este componente é puramente estático (apenas apresentação),
 * portanto, nenhuma lógica reativa (como ref, reactive, computed)
 * ou hooks de ciclo de vida (como onMounted) são necessários.
 */
</script>

<style scoped>
/**
 * Estilização Local (scoped)
 * * Utiliza a metodologia BEM (not-found-view__content) conforme
 * definido na Seção 5.0 do Arquitetura Frontend - Sistema CMMS.MD.
 *
 * As variáveis de cor (ex: var(--color-primary)) vêm do
 * Design System global definido em src/styles/_variables.css.
 */
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
  background-color: var(--color-background-light);
}

.not-found-view__content {
  max-width: 500px;
}

.not-found-view__error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary); 
  line-height: 1;
}

.not-found-view__title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.not-found-view__message {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 2.5rem;
}

.not-found-view__action {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--color-white);
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.not-found-view__action:hover {
  background-color: var(--color-primary-dark);
}
</style>