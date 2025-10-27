/**
 * @file BaseTabs.vue
 * @description Componente de base reutilizável para navegação em abas.
 * Gerencia o estado de qual aba está ativa e exibe o conteúdo correspondente
 * através de slots nomeados dinamicamente.
 * @path src/components/base/BaseTabs.vue
 */
<template>
  <div class="base-tabs">
    <!-- 1. Lista de Triggers (Abas) -->
    <ul class="base-tabs__list" role="tablist">
      <li
        v-for="tab in tabs"
        :key="tab.id"
        class="base-tabs__trigger-item"
        role="presentation"
      >
        <button
          :id="`tab-${tab.id}`"
          class="base-tabs__trigger"
          :class="{ 'base-tabs__trigger--active': tab.id === activeTab }"
          role="tab"
          :aria-selected="tab.id === activeTab"
          :aria-controls="`panel-${tab.id}`"
          @click="selectTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <!-- 2. Contêiner de Conteúdo (Painéis) -->
    <!-- 
      Este contêiner renderiza dinamicamente o painel de conteúdo
      correspondente à aba ativa, usando slots nomeados.
      
      Exemplo de uso no componente pai:
      <BaseTabs v-model="activeTabId" :tabs="myTabs">
        <template #details>
          <p>Conteúdo da aba Detalhes aqui.</p>
        </template>
        <template #history>
          <p>Conteúdo da aba Histórico aqui.</p>
        </template>
      </BaseTabs>
    -->
    <div class="base-tabs__content-wrapper">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :id="`panel-${tab.id}`"
        class="base-tabs__content"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.id}`"
        v-show="tab.id === activeTab"
      >
        <!-- O slot é nomeado dinamicamente com base no ID da aba -->
        <slot :name="tab.id" :tab="tab"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

// Definição das props do componente
const props = defineProps({
  /**
   * Um array de objetos de aba.
   * Cada objeto deve ter 'id' (string única) e 'label' (texto da aba).
   * Ex: [{ id: 'details', label: 'Detalhes' }, { id: 'history', label: 'Histórico' }]
   */
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      // Validador para garantir que a estrutura das tabs está correta
      return value.every(tab =>
        typeof tab === 'object' &&
        tab !== null &&
        'id' in tab &&
        'label' in tab
      );
    }
  },
  /**
   * O 'id' da aba que deve ser exibida.
   * Usado para suportar v-model.
   */
  modelValue: {
    type: String,
    required: false,
    default: null
  }
});

// Definição dos eventos que o componente emite
const emit = defineEmits(['update:modelValue', 'tab-change']);

// Estado interno para rastrear a aba ativa.
// Se o v-model (modelValue) não for fornecido, ele usa a primeira aba da lista.
const internalActiveTab = ref(props.modelValue || (props.tabs.length > 0 ? props.tabs[0].id : null));

/**
 * Computada que decide se usa o estado interno ou o v-model externo.
 * Isso permite que o componente funcione com ou sem v-model.
 */
const activeTab = computed({
  get: () => (props.modelValue !== null ? props.modelValue : internalActiveTab.value),
  set: (value) => {
    internalActiveTab.value = value;
    emit('update:modelValue', value);
    emit('tab-change', value);
  }
});

/**
 * @function selectTab
 * @description Atualiza a aba ativa quando um botão de aba é clicado.
 * @param {string} tabId - O ID da aba a ser selecionada.
 */
function selectTab(tabId) {
  activeTab.value = tabId;
}

// Observador para garantir que, se o modelValue externo mudar, o estado interno reflita.
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalActiveTab.value) {
    internalActiveTab.value = newValue;
  }
});

// Observador para garantir que, se as 'tabs' mudarem,
// o estado ativo seja redefinido para a primeira aba, caso o v-model não esteja em uso.
watch(() => props.tabs, (newTabs) => {
  if (
    props.modelValue === null && 
    newTabs.length > 0 && 
    !newTabs.find(t => t.id === activeTab.value)
  ) {
    activeTab.value = newTabs[0].id;
  }
}, { immediate: true }); // 'immediate: true' garante que isso rode na montagem inicial

</script>

<style scoped>
/* Estilização BEM baseada nos Design Tokens do Arquitetura Frontend - Sistema CMMS.MD */

.base-tabs {
  width: 100%;
}

.base-tabs__list {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  /* Cor da borda definida no Design System */
  border-bottom: 2px solid var(--color-border-default, #e0e0e0);
  overflow-x: auto; /* Permite scroll horizontal em telas menores */
  -webkit-overflow-scrolling: touch; /* Scroll suave em iOS */
}

.base-tabs__trigger-item {
  margin: 0;
}

.base-tabs__trigger {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-muted); /* Cor para abas inativas */
  
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent; /* Borda inferior invisível para alinhamento */
  
  padding: var(--spacing-3) var(--spacing-4); /* Espaçamento interno */
  margin-bottom: -2px; /* Puxa o botão para baixo para sobrepor a borda do container */
  
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap; /* Impede que o texto da aba quebre */
}

.base-tabs__trigger:hover {
  color: var(--color-text-default);
  background-color: var(--color-background-hover, #f9f9f9);
}

.base-tabs__trigger:focus-visible {
  /* Estilo de foco para acessibilidade */
  outline: 2px solid var(--color-primary-focus-ring, #90cdf4);
  outline-offset: 2px;
  border-radius: var(--border-radius-md, 4px);
}

/* Estilo da aba ativa */
.base-tabs__trigger--active {
  color: var(--color-primary-default, #3b82f6);
  border-color: var(--color-primary-default, #3b82f6);
}

/* Contêiner para os painéis de conteúdo */
.base-tabs__content-wrapper {
  /* Espaçamento entre as abas e o conteúdo */
  padding-top: var(--spacing-5); 
}

.base-tabs__content {
  /* O conteúdo é renderizado pelo slot */
}
</style>
