/**
 * @file BaseSelect.vue
 * @description Componente base para seleção de opções em dropdown (simplificado).
 * @path src/components/base/BaseSelect.vue
 * @version 0.5.0 - Versão inicial simplificada
 * @date 2025-10-24
 */
<template>
  <div class="base-select-wrapper" ref="wrapperRef">
    <label v-if="label" :id="labelId" class="base-select-label">{{ label }}</label>
    <button
      type="button"
      ref="triggerRef"
      class="base-select-trigger"
      :class="{ 'base-select-trigger--open': isOpen, 'base-select-trigger--disabled': disabled }"
      :disabled="disabled"
      @click="toggleDropdown"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-labelledby="labelId + ' ' + triggerId"
      :id="triggerId"
    >
      <span class="base-select-value">
        {{ displayValue }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down base-select-chevron" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
      </svg>
    </button>

    <!-- Dropdown List -->
    <ul
      v-show="isOpen"
      ref="listboxRef"
      class="base-select-listbox"
      role="listbox"
      :aria-labelledby="labelId"
      tabindex="-1"
    >
      <li
        v-if="loading"
        class="base-select-option base-select-option--loading"
        role="presentation"
      >
        Carregando... <!-- Usar BaseSpinner aqui -->
      </li>
      <li
        v-else-if="options.length === 0"
        class="base-select-option base-select-option--empty"
        role="presentation"
      >
        Nenhuma opção disponível
      </li>
      <template v-else>
        <li
          v-for="(option, index) in options"
          :key="option.value"
          :ref="el => optionRefs[index] = el"
          class="base-select-option"
          :class="{
            'base-select-option--selected': isSelected(option),
            'base-select-option--disabled': option.disabled,
            'base-select-option--focused': focusedOptionIndex === index
          }"
          role="option"
          :aria-selected="isSelected(option)"
          :aria-disabled="option.disabled"
          @click="selectOption(option)"
          @mouseenter="focusedOptionIndex = index"
        >
          <!-- Slot com escopo para customizar a renderização da opção -->
          <slot name="option" :option="option" :index="index">
            {{ option.label }}
          </slot>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
/**
 * @description Script setup para BaseSelect (simplificado).
 * Gerencia o estado de abertura, seleção e exibe opções.
 *
 * @props {String | Number | Array} modelValue - O valor(es) selecionado(s) (v-model).
 * @props {Array} options - Array de objetos { label: String, value: String|Number, disabled?: Boolean }.
 * @props {String} label - Texto do rótulo associado.
 * @props {String} placeholder - Texto exibido quando nada está selecionado. Padrão: 'Selecione uma opção'.
 * @props {Boolean} disabled - Desabilita o seletor. Padrão: false.
 * @props {String} mode - Modo de seleção ('single', 'multiple'). Padrão: 'single'. (Multiple não implementado nesta versão).
 * @props {Boolean} loading - Exibe indicador de carregamento. Padrão: false.
 * @props {String} id - ID único. Gerado automaticamente se não fornecido.
 *
 * @emits update:modelValue - Emitido quando a seleção muda. Payload: String | Number | Array.
 *
 * @slots option - Slot com escopo para customizar a renderização de cada item. Recebe { option, index }.
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: undefined,
  },
  options: {
    type: Array,
    default: () => [], // { label: string, value: string | number, disabled?: boolean }
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecione uma opção',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    validator: (value) => ['single', 'multiple'].includes(value),
    default: 'single', // Multiple mode not fully implemented here
  },
  loading: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

// Refs DOM
const wrapperRef = ref(null);
const triggerRef = ref(null);
const listboxRef = ref(null);
const optionRefs = ref([]); // Array para refs das opções <li>

// Estado interno
const isOpen = ref(false);
const focusedOptionIndex = ref(-1); // Índice da opção com foco de teclado

// IDs para acessibilidade
const uniqueId = computed(() => props.id || `base-select-${Math.random().toString(36).substring(2, 9)}`);
const labelId = computed(() => `${uniqueId.value}-label`);
const triggerId = computed(() => `${uniqueId.value}-trigger`);

// Valor exibido no botão gatilho
const displayValue = computed(() => {
    if (props.mode === 'single') {
        const selectedOption = props.options.find(opt => opt.value === props.modelValue);
        return selectedOption ? selectedOption.label : props.placeholder;
    }
    // Lógica para modo múltiplo (simplificada)
    if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
        return `${props.modelValue.length} selecionado(s)`;
    }
    return props.placeholder;
});

// Verifica se uma opção está selecionada
function isSelected(option) {
    if (props.mode === 'single') {
        return props.modelValue === option.value;
    }
    // Lógica para modo múltiplo
    return Array.isArray(props.modelValue) && props.modelValue.includes(option.value);
}

// Abre/fecha o dropdown
function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
      focusedOptionIndex.value = props.options.findIndex(opt => opt.value === props.modelValue);
      if (focusedOptionIndex.value === -1) focusedOptionIndex.value = 0;
      nextTick(() => listboxRef.value?.focus()); // Foca na lista para navegação
  }
}

// Seleciona uma opção
function selectOption(option) {
  if (option.disabled) return;

  if (props.mode === 'single') {
    emit('update:modelValue', option.value);
    isOpen.value = false; // Fecha dropdown no single mode
    triggerRef.value?.focus(); // Devolve foco ao botão
  } else {
    // Lógica para modo múltiplo (simplificada: adiciona/remove do array)
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValue.indexOf(option.value);
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(option.value);
    }
    emit('update:modelValue', currentValue);
    // Não fecha o dropdown no modo múltiplo automaticamente
  }
}

// Fecha o dropdown se clicar fora
function handleClickOutside(event) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

// Lógica de Teclado (Simplificada)
function handleKeydown(event) {
    if (!isOpen.value) return;

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            focusedOptionIndex.value = (focusedOptionIndex.value + 1) % props.options.length;
            scrollToOption(focusedOptionIndex.value);
            break;
        case 'ArrowUp':
            event.preventDefault();
            focusedOptionIndex.value = (focusedOptionIndex.value - 1 + props.options.length) % props.options.length;
            scrollToOption(focusedOptionIndex.value);
            break;
        case 'Enter':
        case ' ': // Space selects too
            event.preventDefault();
            if (focusedOptionIndex.value >= 0 && props.options[focusedOptionIndex.value]) {
                selectOption(props.options[focusedOptionIndex.value]);
            }
            break;
        case 'Escape':
            event.preventDefault();
            isOpen.value = false;
            triggerRef.value?.focus();
            break;
        case 'Tab':
             isOpen.value = false; // Fecha ao navegar com Tab
             break;
    }
}

// Garante que a opção focada esteja visível
function scrollToOption(index) {
    nextTick(() => {
        const optionElement = optionRefs.value[index];
        optionElement?.scrollIntoView({ block: 'nearest' });
    });
}

// Reseta refs das opções quando as opções mudam
watch(() => props.options, () => {
    optionRefs.value = [];
}, { deep: true });

// Adiciona/Remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  wrapperRef.value?.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  wrapperRef.value?.removeEventListener('keydown', handleKeydown); // Previne memory leak
});

</script>

<style scoped>
.base-select-wrapper {
  position: relative;
  margin-bottom: var(--spacing-4, 1rem);
}

.base-select-label {
  display: block;
  margin-bottom: var(--spacing-1, 0.25rem);
  font-size: var(--font-size-label, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-label, #1f2937);
}

.base-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--padding-input-medium, 0.5rem 0.75rem);
  font-size: var(--font-size-body, 1rem);
  line-height: 1.5;
  color: var(--color-text-default, #1f2937);
  background-color: var(--color-background-surface, #ffffff);
  border: 1px solid var(--color-border-input, #d1d5db);
  border-radius: var(--border-radius-medium, 6px);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-duration-fast), box-shadow var(--transition-duration-fast);
}

.base-select-trigger:focus {
  outline: none;
  border-color: var(--color-border-input-focus, #3b82f6);
  box-shadow: 0 0 0 var(--shadow-focus-ring, 3px) var(--shadow-color-input-focus, rgba(59, 130, 246, 0.25));
}

.base-select-trigger--disabled {
  background-color: var(--color-background-disabled, #f3f4f6);
  cursor: not-allowed;
  opacity: 0.7;
}

.base-select-value {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* Estilo para o placeholder */
.base-select-trigger:has(.base-select-value:empty)::before,
.base-select-value:has(+ .base-select-chevron) { /* Lógica complexa para placeholder, pode precisar de ajuste */
  /* color: var(--color-text-placeholder, #6b7280); */
}
.base-select-trigger[aria-expanded="false"] .base-select-value:not(:empty) + .base-select-chevron + span::before {
    /* Esconde placeholder se tiver valor */
}


.base-select-chevron {
  flex-shrink: 0;
  margin-left: var(--spacing-2, 0.5rem);
  transition: transform var(--transition-duration-fast);
}

.base-select-trigger--open .base-select-chevron {
  transform: rotate(180deg);
}

.base-select-listbox {
  position: absolute;
  top: calc(100% + var(--spacing-1, 0.25rem));
  left: 0;
  width: 100%;
  max-height: 200px; /* Altura máxima para scroll */
  overflow-y: auto;
  background-color: var(--color-background-surface, #ffffff);
  border: 1px solid var(--color-border-default, #d1d5db);
  border-radius: var(--border-radius-medium, 6px);
  box-shadow: var(--shadow-lg);
  list-style: none;
  padding: var(--spacing-1, 0.25rem) 0;
  margin: 0;
  z-index: 10; /* Garante que fique sobre outros elementos */
}
.base-select-listbox:focus { outline: none; } /* Remove outline da lista */


.base-select-option {
  padding: var(--spacing-2, 0.5rem) var(--spacing-3, 0.75rem);
  font-size: var(--font-size-body, 1rem);
  color: var(--color-text-default, #1f2937);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-select-option--selected {
  background-color: var(--color-blue-100, #dbeafe); /* Fundo da opção selecionada */
  font-weight: var(--font-weight-medium, 500);
}

.base-select-option--focused {
   background-color: var(--color-background-muted, #f3f4f6); /* Fundo da opção focada (teclado/mouse) */
}

.base-select-option--disabled {
  color: var(--color-text-muted, #6b7280);
  cursor: not-allowed;
  opacity: 0.7;
}

.base-select-option--loading,
.base-select-option--empty {
  color: var(--color-text-muted, #6b7280);
  text-align: center;
  font-style: italic;
  padding: var(--spacing-4, 1rem);
}
</style>
