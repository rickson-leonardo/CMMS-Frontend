/**
 * @file LocationManagementView.vue
 * @description View principal para a Gestão de Localizações, apresentando um mapa
 * interativo para fixar e visualizar ativos.
 * @path src/features/locations/LocationManagementView.vue
 */
<template>
  <div class="location-management-view">
    <BaseHeader title="Gestão de Localizações com Mapa">
      <BaseButton variant="primary" icon-name="map-pin">
        Adicionar Localização
      </BaseButton>
    </BaseHeader>

    <div class="content-container">
      <!-- Painel Lateral de Lista de Localizações -->
      <aside class="sidebar-panel">
        <h3 class="panel-title">Localizações Cadastradas (23)</h3>
        <BaseInput
          v-model="searchTerm"
          placeholder="Buscar Localização ou Ativo..."
          id="location-search"
          type="search"
          class="mb-4"
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.085.118l3.865 3.864a1 1 0 0 0 1.414-1.414l-3.865-3.864q-.058-.043-.118-.085m-1.406 1.397a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11"/>
            </svg>
          </template>
        </BaseInput>

        <!-- Simulação de Lista de Localizações -->
        <ul class="location-list">
          <li v-for="i in 5" :key="i" class="location-item">
            <span class="location-name">Setor de Produção A{{ i }}</span>
            <span class="location-assets">4 Ativos</span>
          </li>
        </ul>
        <div class="text-center mt-4">
            <BaseButton variant="secondary" size="small">Ver Todas</BaseButton>
        </div>
      </aside>

      <!-- Área Principal do Mapa -->
      <div class="map-area">
        <div class="map-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-map text-gray-400 mb-3" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14.993a.5.5 0 0 1-.817.387l-2.585-1.926a.87.87 0 0 0-.898-.066L10.3 14.502 7.6 12.38a.87.87 0 0 0-.965 0L3.71 14.887l-2.585 1.926A.5.5 0 0 1 0 15.493V.5a.5.5 0 0 1 .817-.387l2.585 1.926c.45.336.966.495 1.458.495.539 0 1.139-.283 1.872-.888.647-.52 1.258-.888 1.914-.888s1.267.368 1.914.888c.733.605 1.333.888 1.872.888s1.008-.16 1.458-.495l2.585-1.926Z"/>
            <path fill-rule="evenodd" d="M15.767 1.49l-2.585 1.926c-.23.173-.497.26-.774.26a.85.85 0 0 1-.722-.397l-1.914-.888c-.647-.52-1.258-.888-1.914-.888s-1.267.368-1.914.888l-1.914.888c-.22.102-.423.16-.622.16-.145 0-.285-.034-.412-.112L1.033 1.49V15.5l2.42-1.803a.87.87 0 0 1 .898-.066l2.585 2.122a.87.87 0 0 0 .966 0l2.585-2.122a.87.87 0 0 1 .966 0l2.585 2.122a.87.87 0 0 0 .898-.066l2.42-1.803V1.49Z"/>
          </svg>
          <p class="text-gray-500 font-semibold">Área de Visualização do Mapa (Leaflet/MapLibre)</p>
          <p class="text-gray-400 text-sm">Clique em uma localização para fixar, ou use o painel lateral.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';

const searchTerm = ref('');
</script>

<style scoped>
.location-management-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden; /* Garante que o conteúdo dentro do flex não exceda */
  background-color: var(--color-background-page);
}

.sidebar-panel {
  flex-shrink: 0;
  width: 300px;
  background-color: var(--color-background-surface);
  border-right: 1px solid var(--color-border-default);
  padding: var(--spacing-6);
  overflow-y: auto; /* Permite rolagem apenas no painel lateral */
}

.panel-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-default);
    margin-bottom: var(--spacing-4);
}

.map-area {
  flex-grow: 1;
  background-color: var(--color-gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.map-placeholder {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-8);
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--border-radius-large);
  background-color: var(--color-white);
}

/* Estilos de Lista */
.location-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-2);
  border-bottom: 1px solid var(--color-border-subtle);
  cursor: pointer;
  transition: background-color var(--transition-duration-fast);
}

.location-item:hover {
  background-color: var(--color-gray-50);
}

.location-name {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-default);
}

.location-assets {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    background-color: var(--color-blue-50);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius-medium);
}

</style>
