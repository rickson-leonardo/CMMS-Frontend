/**
 * @file BaseCard.vue
 * @description Componente reutilizável para exibir conteúdo em um container
 * com bordas, título opcional e slots para customização.
 * @path src/components/base/BaseCard.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="base-card" :class="cardClasses">
    <!-- Slot para Imagem de Capa (Opcional) -->
    <div v-if="$slots.cover" class="base-card__cover">
      <slot name="cover"></slot>
    </div>

    <!-- Cabeçalho (Opcional, renderizado se 'title' ou slot 'extra' existir) -->
    <div v-if="title || $slots.extra" class="base-card__header">
      <div v-if="title" class="base-card__title">{{ title }}</div>
      <div v-if="$slots.extra" class="base-card__extra">
        <slot name="extra"></slot>
      </div>
    </div>

    <!-- Corpo Principal do Card -->
    <div class="base-card__body">
      <slot></slot> <!-- Slot padrão para o conteúdo principal -->
    </div>

    <!-- Rodapé com Ações (Opcional) -->
    <div v-if="$slots.actions" class="base-card__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * @props {String} title - Título opcional exibido no cabeçalho do card. Padrão: ''.
 * @props {Boolean} bordered - Se true, exibe uma borda ao redor do card. Padrão: true.
 * @props {Boolean} hoverable - Se true, aplica um efeito de elevação ao passar o mouse. Padrão: false.
 *
 * @slots default - O conteúdo principal (corpo) do card.
 * @slots cover - Uma área para exibir uma imagem ou mídia na parte superior do card.
 * @slots extra - Conteúdo a ser exibido no canto superior direito do cabeçalho (ex: um botão ou link).
 * @slots actions - Uma área no rodapé do card para exibir uma lista de ações.
 */
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
});

// Calcula classes CSS dinâmicas baseadas nas props
const cardClasses = computed(() => ({
  'base-card--bordered': props.bordered,
  'base-card--hoverable': props.hoverable,
}));
</script>

<style scoped>
/* Estilização BEM para o componente BaseCard */
.base-card {
  background-color: var(--color-background-surface);
  border-radius: var(--border-radius-large);
  color: var(--color-text-default);
  transition: box-shadow var(--transition-duration-fast) var(--transition-timing-default),
              transform var(--transition-duration-fast) var(--transition-timing-default);
  overflow: hidden; /* Garante que cover e bordas funcionem bem */
}

/* Modificador: Com Borda */
.base-card--bordered {
  border: 1px solid var(--color-border-default);
}

/* Modificador: Efeito Hover */
.base-card--hoverable:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px); /* Efeito sutil de elevação */
}

/* Elemento: Capa (Imagem/Mídia) */
.base-card__cover > :deep(img) { /* Aplica estilo ao elemento img dentro do slot */
  display: block;
  width: 100%;
}

/* Elemento: Cabeçalho */
.base-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6); /* Espaçamento interno */
  border-bottom: 1px solid var(--color-border-default);
}

/* Elemento: Título */
.base-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0; /* Remove margem padrão do título */
}

/* Elemento: Extra (no cabeçalho) */
.base-card__extra {
  font-size: var(--font-size-sm);
}

/* Elemento: Corpo */
.base-card__body {
  padding: var(--spacing-6); /* Espaçamento interno padrão */
}

/* Elemento: Ações (Rodapé) */
.base-card__actions {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border-default);
  /* Estilos para alinhar itens, se necessário (ex: usando flex) */
  display: flex;
  gap: var(--spacing-2); /* Espaço entre ações */
}

/* Ajustes caso não haja cabeçalho ou rodapé para o padding do corpo */
.base-card:not(:has(.base-card__header)) .base-card__body {
  padding-top: var(--spacing-6);
}
.base-card:not(:has(.base-card__actions)) .base-card__body {
  padding-bottom: var(--spacing-6);
}
.base-card:has(.base-card__header) .base-card__body {
   padding-top: var(--spacing-6);
}
.base-card:has(.base-card__actions) .base-card__body {
   padding-bottom: var(--spacing-6);
}
/* Garante padding superior no body se tiver cover mas não header */
.base-card:has(.base-card__cover):not(:has(.base-card__header)) .base-card__body {
    padding-top: var(--spacing-6);
}
</style>
