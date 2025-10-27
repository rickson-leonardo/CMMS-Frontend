/**
 * @file BaseButton.vue
 * @description Componente base de botão reutilizável.
 * @path src/components/base/BaseButton.vue
 * @version 1.0.1
 * @date 2025-10-24
 */

<template>
  <button
    :type="htmlType"
    :class="buttonClasses"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span v-if="loading" class="button__loader" role="status" aria-live="polite">
      <!-- Simple spinner animation -->
      <span class="spinner"></span>
    </span>
    <span v-if="$slots.icon && !loading" class="button__icon">
      <slot name="icon"></slot>
    </span>
    <span class="button__content" :class="{ 'button__content--hidden': loading }">
      <slot></slot> <!-- Default slot for button text -->
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

/**
 * @component BaseButton
 * @description Um componente de botão fundamental e reutilizável para acionar ações.
 * Segue o padrão WAI-ARIA Button (https://www.w3.org/WAI/ARIA/apg/patterns/button/).
 * Utiliza BEM para nomenclatura de classes e Design Tokens (Variáveis CSS) para estilização.
 *
 * @props {String} variant - Define o estilo visual e semântico. ('primary', 'secondary', 'danger', 'text', 'link'). Padrão: 'secondary'.
 * @props {String} size - Define o tamanho do botão. ('small', 'medium', 'large'). Padrão: 'medium'.
 * @props {String} shape - Define a forma do botão. ('default', 'round', 'circle'). Padrão: 'default'.
 * @props {Boolean} disabled - Se true, desabilita o botão para interação. Padrão: false.
 * @props {Boolean} loading - Se true, exibe um ícone de carregamento e desabilita o botão. Padrão: false.
 * @props {String} htmlType - O atributo type do elemento <button> nativo. ('button', 'submit', 'reset'). Padrão: 'button'.
 *
 * @slots icon - Slot opcional para adicionar um ícone ao lado do texto.
 * @slots default - O conteúdo principal do botão, geralmente o texto do rótulo.
 *
 * @emits click - Emitido quando o botão é clicado. Payload: MouseEvent.
 */

const props = defineProps({
  variant: {
    type: String,
    default: 'secondary',
    validator: (value) => ['primary', 'secondary', 'danger', 'text', 'link'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  shape: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'round', 'circle'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  htmlType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
});

const emit = defineEmits(['click']);

// Computed property para determinar se o botão está desabilitado (prop disabled ou loading)
const isDisabled = computed(() => props.disabled || props.loading);

// Computed property para gerar as classes BEM dinamicamente
const buttonClasses = computed(() => [
  'button',
  `button--variant-${props.variant}`,
  `button--size-${props.size}`,
  `button--shape-${props.shape}`,
  { 'button--disabled': isDisabled.value },
  { 'button--loading': props.loading },
]);

// Handler para o evento de clique
function handleClick(event) {
  if (!isDisabled.value) {
    emit('click', event);
  }
}
</script>

<style scoped>
/* Estilos base do botão usando tokens semânticos (variáveis CSS) */
.button {
  /* Layout e Box Model */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-button-medium); /* Token semântico */
  border: 1px solid transparent;
  border-radius: var(--border-radius-medium); /* Token semântico */
  font-family: var(--font-family-sans); /* Token primitivo/semântico */
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  position: relative; /* Para posicionar o loader */
  overflow: hidden; /* Para esconder conteúdo durante loading */
}

/* --- Variantes (Modifiers) --- */
.button--variant-primary {
  background-color: var(--color-interactive-primary, #3b82f6); /* Cor primária com fallback */
  color: var(--color-text-on-interactive, #ffffff);
  border-color: var(--color-interactive-primary, #3b82f6);
}
.button--variant-primary:not(.button--disabled):hover {
  background-color: var(--color-interactive-primary-hover, #2563eb);
  border-color: var(--color-interactive-primary-hover, #2563eb);
}

.button--variant-secondary {
  background-color: var(--color-background-surface, #ffffff);
  color: var(--color-text-default, #1f2937);
  border-color: var(--color-border-default, #d1d5db);
}
.button--variant-secondary:not(.button--disabled):hover {
  background-color: var(--color-background-muted, #f3f4f6);
}

.button--variant-danger {
  background-color: var(--color-feedback-error, #ef4444);
  color: var(--color-text-on-interactive, #ffffff);
  border-color: var(--color-feedback-error, #ef4444);
}
.button--variant-danger:not(.button--disabled):hover {
  background-color: var(--color-feedback-error-hover, #dc2626);
  border-color: var(--color-feedback-error-hover, #dc2626);
}

.button--variant-text,
.button--variant-link {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-interactive-primary, #3b82f6);
  padding-left: var(--spacing-1, 0.25rem); /* Menor padding para text/link */
  padding-right: var(--spacing-1, 0.25rem);
}
.button--variant-text:not(.button--disabled):hover,
.button--variant-link:not(.button--disabled):hover {
  background-color: var(--color-background-interactive-subtle, rgba(59, 130, 246, 0.1));
}
.button--variant-link {
   /* Estilo adicional para parecer link, se necessário */
  text-decoration: underline;
}

/* --- Tamanhos (Modifiers) --- */
.button--size-small {
  padding: var(--padding-button-small, 0.25rem 0.5rem); /* Token semântico */
  font-size: var(--font-size-sm, 0.875rem);
}
.button--size-medium {
  padding: var(--padding-button-medium, 0.5rem 1rem); /* Padrão já definido */
  font-size: var(--font-size-md, 1rem);
}
.button--size-large {
  padding: var(--padding-button-large, 0.75rem 1.5rem); /* Token semântico */
  font-size: var(--font-size-lg, 1.125rem);
}

/* --- Formas (Modifiers) --- */
.button--shape-round {
  border-radius: var(--border-radius-full, 9999px);
}
.button--shape-circle {
  border-radius: 50%;
  padding: 0; /* Remover padding para círculo */
  /* Ajustar width/height baseado no size */
}
.button--size-small.button--shape-circle { width: 32px; height: 32px; }
.button--size-medium.button--shape-circle { width: 40px; height: 40px; }
.button--size-large.button--shape-circle { width: 48px; height: 48px; }

/* --- Estados (Modifiers) --- */
.button--disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

/* --- Elementos --- */
.button__icon {
  display: inline-flex;
  align-items: center;
  margin-right: var(--spacing-1, 0.25rem); /* Espaço entre ícone e texto */
}
/* Se for apenas ícone (sem texto no slot default), remove margem */
.button__content:empty + .button__icon,
.button__icon:has(+ .button__content:empty) {
    margin-right: 0;
}
/* No caso de botão circular, centraliza ícone */
.button--shape-circle .button__icon {
    margin: 0;
}

/* --- Estado de Loading --- */
.button--loading .button__content,
.button--loading .button__icon {
  visibility: hidden; /* Esconde conteúdo */
}
.button__loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit; /* Cor do spinner igual à cor do texto */
}

/* Spinner Simples */
.spinner {
  display: inline-block;
  width: 1em; /* Tamanho relativo à font-size do botão */
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Ocultar conteúdo visualmente mas manter acessível */
.button__content--hidden {
  visibility: hidden;
}
</style>

    