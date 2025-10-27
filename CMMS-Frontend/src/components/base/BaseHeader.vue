/**
 * @file BaseHeader.vue
 * @description Componente de base reutilizável para cabeçalhos de página ou seções.
 * Exibe um título e permite a inclusão de conteúdo adicional (ações) através de um slot.
 * @path src/components/base/BaseHeader.vue
 */
<template>
  <header class="base-header">
    <h1 class="base-header__title">{{ title }}</h1>
    <div class="base-header__actions">
      <slot></slot> <!-- Slot padrão para botões de ação, menus, etc. -->
    </div>
  </header>
</template>

<script setup>
/**
 * Props do componente BaseHeader.
 * @property {string} title - O texto a ser exibido como título principal do cabeçalho.
 */
defineProps({
  title: {
    type: String,
    required: true,
    default: 'Título Padrão' // Valor padrão caso a prop não seja fornecida
  }
});
</script>

<style scoped>
/* Utiliza a metodologia BEM e Design Tokens definidos em Arquitetura Frontend - Sistema CMMS.MD */
.base-header {
  display: flex; /* Organiza título e ações lado a lado */
  justify-content: space-between; /* Espaça o título à esquerda e ações à direita */
  align-items: center; /* Alinha verticalmente os itens */
  padding: var(--spacing-4) var(--spacing-6); /* Usa tokens de espaçamento semântico */
  background-color: var(--color-background-surface); /* Usa token de cor de fundo */
  border-bottom: 1px solid var(--color-border-default, #e5e7eb); /* Cor de borda padrão ou token */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}

.base-header__title {
  font-size: var(--font-size-xl, 1.25rem); /* Usa token de tamanho de fonte ou valor padrão */
  font-weight: var(--font-weight-semibold, 600); /* Usa token de peso de fonte ou valor padrão */
  color: var(--color-text-default); /* Usa token de cor de texto */
  margin: 0; /* Remove margem padrão do h1 */
}

.base-header__actions {
  display: flex; /* Permite múltiplos elementos no slot */
  gap: var(--spacing-2); /* Espaçamento entre os elementos no slot */
}
</style>
