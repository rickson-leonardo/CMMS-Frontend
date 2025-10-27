/**
 * @file BaseTextarea.vue
 * @description Componente base para entrada de texto de múltiplas linhas (textarea).
 * @path src/components/base/BaseTextarea.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="base-textarea-wrapper">
    <label v-if="label" :for="textareaId" class="base-textarea-label">{{ label }}</label>
    <textarea
      :id="textareaId"
      class="base-textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :class="[
        { 'base-textarea--disabled': disabled },
        { 'base-textarea--readonly': readonly },
        status ? `base-textarea--status-${status}` : ''
      ]"
      :aria-invalid="status === 'error'"
      aria-multiline="true"
      @input="onInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    ></textarea>
    <!-- Adicionar mensagens de erro/ajuda aqui futuramente -->
  </div>
</template>

<script setup>
/**
 * @description Script setup para BaseTextarea.
 * Gerencia o v-model, props e emits para o componente textarea.
 *
 * @props {String | Number} modelValue - O valor do campo de texto (usado por v-model).
 * @props {String} label - Texto do rótulo associado ao campo.
 * @props {String} placeholder - Texto de ajuda exibido quando o campo está vazio.
 * @props {Boolean} disabled - Desabilita o campo para interação. Padrão: false.
 * @props {Boolean} readonly - Torna o campo apenas leitura. Padrão: false.
 * @props {String} status - Estado de validação visual ('error', 'warning').
 * @props {Number} rows - Número inicial de linhas visíveis. Padrão: 3.
 * @props {Boolean} autoResize - Se true, ajusta a altura automaticamente (não implementado neste exemplo básico). Padrão: false.
 * @props {String} id - ID único para o elemento <textarea>. Gerado automaticamente se não fornecido.
 *
 * @emits update:modelValue - Emitido a cada alteração no valor para suportar v-model. Payload: String.
 * @emits blur - Emitido quando o campo perde o foco. Payload: FocusEvent.
 * @emits focus - Emitido quando o campo ganha foco. Payload: FocusEvent.
 */
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    validator: (value) => ['error', 'warning'].includes(value),
    default: undefined,
  },
  rows: {
    type: Number,
    default: 3,
  },
  autoResize: {
    type: Boolean,
    default: false, // Implementação de auto-resize pode ser complexa, omitida por simplicidade inicial
  },
  id: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

// Gera um ID único se não for fornecido via prop
const textareaId = computed(() => props.id || `base-textarea-${Math.random().toString(36).substring(2, 9)}`);

// Função para emitir o evento update:modelValue
function onInput(event) {
  emit('update:modelValue', event.target.value);
  // Lógica de auto-resize poderia ser adicionada aqui
}
</script>

<style scoped>
.base-textarea-wrapper {
  margin-bottom: var(--spacing-4, 1rem); /* Espaçamento padrão abaixo */
}

.base-textarea-label {
  display: block;
  margin-bottom: var(--spacing-1, 0.25rem);
  font-size: var(--font-size-label, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-label, #1f2937);
}

.base-textarea {
  display: block;
  width: 100%;
  padding: var(--padding-input-medium, 0.5rem 0.75rem);
  font-size: var(--font-size-body, 1rem);
  line-height: 1.5;
  color: var(--color-text-default, #1f2937);
  background-color: var(--color-background-surface, #ffffff);
  border: 1px solid var(--color-border-input, #d1d5db);
  border-radius: var(--border-radius-medium, 6px);
  transition: border-color var(--transition-duration-fast), box-shadow var(--transition-duration-fast);
  box-sizing: border-box; /* Garante que padding não aumente o tamanho total */
  resize: vertical; /* Permite redimensionamento vertical pelo usuário */
}

.base-textarea::placeholder {
  color: var(--color-text-placeholder, #6b7280);
  opacity: 1; /* Override Firefox default */
}

.base-textarea:focus {
  outline: none;
  border-color: var(--color-border-input-focus, #3b82f6);
  box-shadow: 0 0 0 var(--shadow-focus-ring, 3px) var(--shadow-color-input-focus, rgba(59, 130, 246, 0.25));
}

.base-textarea--disabled {
  background-color: var(--color-background-disabled, #f3f4f6);
  cursor: not-allowed;
  opacity: 0.7;
}

.base-textarea--readonly {
  background-color: var(--color-background-muted, #f3f4f6);
}

.base-textarea--status-error {
  border-color: var(--color-border-input-error, #ef4444);
}
.base-textarea--status-error:focus {
  box-shadow: 0 0 0 var(--shadow-focus-ring, 3px) var(--shadow-color-input-error, rgba(239, 68, 68, 0.25));
}

.base-textarea--status-warning {
  border-color: var(--color-border-input-warning, #f59e0b);
}
.base-textarea--status-warning:focus {
  box-shadow: 0 0 0 var(--shadow-focus-ring, 3px) var(--shadow-color-input-warning, rgba(245, 158, 11, 0.25));
}
</style>
