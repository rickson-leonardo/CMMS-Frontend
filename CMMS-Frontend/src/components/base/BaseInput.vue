/**
 * @file BaseInput.vue
 * @description Componente base de input de texto reutilizável.
 * @path src/components/base/BaseInput.vue
 * @version 1.0.0
 * @date 2025-10-24
 */

<template>
  <div class="input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="input__label">{{ label }}</label>
    <div class="input__container">
      <span v-if="$slots.prefix" class="input__prefix">
        <slot name="prefix"></slot>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="status === 'error' ? 'true' : null"
        :aria-disabled="disabled ? 'true' : null"
        class="input__field"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <span v-if="$slots.suffix" class="input__suffix">
        <slot name="suffix"></slot>
      </span>
    </div>
    <!-- Add slot for error messages or hints later if needed -->
  </div>
</template>

<script setup>
import { ref, computed, useAttrs, onMounted } from 'vue';

/**
 * @component BaseInput
 * @description Um componente de entrada de texto fundamental que encapsula um elemento <input> nativo.
 * Suporta v-model, rótulos, placeholders, estados (disabled, readonly, error, warning) e slots para prefixo/sufixo.
 * Segue o padrão WAI-ARIA para Textbox (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/textbox_role).
 * Utiliza BEM para nomenclatura de classes e Design Tokens (Variáveis CSS) para estilização.
 *
 * @props {String | Number} modelValue - O valor do campo de entrada. Usado para v-model. Padrão: ''.
 * @props {String} type - O tipo do elemento <input> nativo ('text', 'password', 'email', 'number', 'tel', 'url'). Padrão: 'text'.
 * @props {String} label - O texto do rótulo associado ao campo. Essencial para acessibilidade. Padrão: ''.
 * @props {String} placeholder - Texto de ajuda exibido no campo quando vazio. Padrão: ''.
 * @props {Boolean} disabled - Se true, desabilita o campo. Padrão: false.
 * @props {Boolean} readonly - Se true, o campo não pode ser editado. Padrão: false.
 * @props {String} status - Define o estado de validação visual ('error', 'warning'). Padrão: undefined.
 * @props {String} id - ID único para o elemento <input>. Se não fornecido, um ID será gerado. Padrão: undefined.
 *
 * @slots prefix - Conteúdo a ser exibido dentro do campo, antes do valor (geralmente um ícone).
 * @slots suffix - Conteúdo a ser exibido dentro do campo, depois do valor (geralmente um ícone).
 *
 * @emits update:modelValue - Emitido a cada alteração no valor para suportar v-model. Payload: String | Number.
 * @emits change - Emitido quando o valor muda e o campo perde o foco. Payload: Event.
 * @emits blur - Emitido quando o campo perde o foco. Payload: FocusEvent.
 * @emits focus - Emitido quando o campo ganha foco. Payload: FocusEvent.
 */

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url'].includes(value),
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
    default: undefined,
    validator: (value) => [undefined, 'error', 'warning'].includes(value),
  },
  id: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus']);
const attrs = useAttrs(); // Acessa atributos não declarados como props
const inputRef = ref(null); // Referência ao elemento <input>

// Gera um ID único se não for fornecido via prop
const inputId = computed(() => props.id || `base-input-${generateUniqueId()}`);

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}

// Classes BEM para o wrapper principal
const wrapperClasses = computed(() => [
  { 'input-wrapper--disabled': props.disabled },
  { [`input-wrapper--status-${props.status}`]: !!props.status },
]);

// Handler para o evento 'input' - atualiza o v-model
function handleInput(event) {
  emit('update:modelValue', event.target.value);
}

// Handler para o evento 'change'
function handleChange(event) {
  emit('change', event);
}

// Handler para o evento 'blur'
function handleBlur(event) {
  emit('blur', event);
}

// Handler para o evento 'focus'
function handleFocus(event) {
  emit('focus', event);
}

// Expõe a referência ao input para uso externo se necessário
defineExpose({ inputRef });

</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input__label {
  display: block;
  margin-bottom: var(--spacing-1, 0.25rem);
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-label, var(--color-text-default, #1f2937));
  font-weight: 500;
}

.input__container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--color-border-input, var(--color-border-default, #d1d5db));
  border-radius: var(--border-radius-medium, 0.375rem);
  background-color: var(--color-background-input, var(--color-background-surface, #ffffff));
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.input-wrapper:not(.input-wrapper--disabled) .input__container:focus-within {
  border-color: var(--color-border-input-focus, var(--color-interactive-primary, #3b82f6));
  box-shadow: 0 0 0 3px var(--shadow-color-input-focus, rgba(59, 130, 246, 0.25));
}

.input__field {
  /* Reset básico e layout */
  flex-grow: 1;
  width: 100%;
  padding: var(--padding-input-medium, 0.5rem 0.75rem);
  border: none;
  background-color: transparent;
  outline: none;
  /* Tipografia */
  font-family: var(--font-family-sans);
  font-size: var(--font-size-md, 1rem);
  color: var(--color-text-input, var(--color-text-default, #1f2937));
}
.input__field::placeholder {
  color: var(--color-text-placeholder, var(--color-text-muted, #6b7280));
  opacity: 1; /* Override Firefox default */
}

/* Estilos para prefixo e sufixo */
.input__prefix,
.input__suffix {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-text-muted, #6b7280);
}
.input__prefix {
  padding-left: var(--spacing-2, 0.5rem);
}
.input__suffix {
  padding-right: var(--spacing-2, 0.5rem);
}
/* Ajusta padding do input quando há prefixo/sufixo */
.input__prefix + .input__field {
  padding-left: var(--spacing-1, 0.25rem);
}
.input__field:has(+ .input__suffix) {
  padding-right: var(--spacing-1, 0.25rem);
}


/* --- Estados (Modifiers no Wrapper) --- */
.input-wrapper--disabled .input__container {
  background-color: var(--color-background-disabled, var(--color-gray-100, #f3f4f6));
  cursor: not-allowed;
  opacity: 0.7;
}
.input-wrapper--disabled .input__field {
  cursor: not-allowed;
}

/* Estilos para Readonly (semelhante a desabilitado, mas visualmente menos impactante) */
.input__field[readonly] {
   /* Pode-se adicionar um estilo sutil se desejado, mas geralmente não é necessário */
   cursor: default;
}

/* --- Status de Validação (Modifiers no Wrapper) --- */
.input-wrapper--status-error .input__container {
  border-color: var(--color-border-input-error, var(--color-feedback-error, #ef4444));
}
.input-wrapper--status-error:not(.input-wrapper--disabled) .input__container:focus-within {
  border-color: var(--color-border-input-error, var(--color-feedback-error, #ef4444));
  box-shadow: 0 0 0 3px var(--shadow-color-input-error, rgba(239, 68, 68, 0.25));
}

.input-wrapper--status-warning .input__container {
  border-color: var(--color-border-input-warning, var(--color-feedback-warning, #f59e0b)); /* Supondo uma variável warning */
}
.input-wrapper--status-warning:not(.input-wrapper--disabled) .input__container:focus-within {
  border-color: var(--color-border-input-warning, var(--color-feedback-warning, #f59e0b));
  box-shadow: 0 0 0 3px var(--shadow-color-input-warning, rgba(245, 158, 11, 0.25));
}

</style>

