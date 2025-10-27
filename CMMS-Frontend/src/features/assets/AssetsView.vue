/**
 * @file AssetsView.vue
 * @description View para listar e filtrar Ativos.
 * @path src/features/assets/AssetsView.vue
 * @version 1.1.0 - Adiciona botões Novo/Editar e navegação
 * @date 2025-10-24
 */
<template>
  <div class="assets-view">
    <div class="header-section">
      <h1 class="view-title">Gestão de Ativos</h1>
      <!-- Botão Novo -->
      <BaseButton variant="primary" @click="goToCreateAsset">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
        Novo Ativo
      </BaseButton>
    </div>

    <!-- Card de Filtros -->
    <BaseCard class="mb-4 filter-card">
       <template #title>Filtros</template>
       <form class="filter-form row g-3 align-items-end">
         <div class="col-md-4">
           <BaseInput label="Buscar" placeholder="Nome, Tag..." />
         </div>
          <div class="col-md-3">
              <BaseSelect label="Localização" :options="[]" placeholder="Todas"/>
          </div>
          <div class="col-md-3">
              <BaseSelect label="Criticidade" :options="[]" placeholder="Todos"/>
          </div>
          <div class="col-md-2">
             <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
          </div>
       </form>
    </BaseCard>

    <!-- Card da Tabela -->
    <BaseCard>
      <BaseTable
        :items="mockAssets"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        class="assets-table"
      >
        <!-- Customização das Células -->
        <template #cell-name="{ item, value }">
             <a href="#" @click.prevent="viewDetails(item.id)" class="fw-bold text-decoration-none">{{ value }}</a>
        </template>

         <template #cell-criticality="{ value }">
            <span :class="['criticism-dot', getCriticismColorClass(value)]" :title="`${value} - ${getCriticismLabel(value)}`"></span>
            {{ value }}
         </template>

        <template #cell-actions="{ item }">
          <!-- Botão Editar na Tabela -->
           <BaseButton variant="secondary" size="small" @click.stop="goToEditAsset(item.id)" class="me-2">
             Editar
           </BaseButton>
           <BaseButton variant="text" size="small" @click.stop="viewDetails(item.id)">
             Detalhes
           </BaseButton>
        </template>

        <template #empty>
          <div class="empty-state">Nenhum Ativo encontrado.</div>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
/**
 * @description Script setup para AssetsView. Inclui dados simulados,
 * configuração da tabela e funções de navegação.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseButton from '@/components/base/BaseButton.vue';
// Placeholders para filtros
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';

const router = useRouter();

// Estado
const isLoading = ref(false);

// Dados simulados
const mockAssets = ref([
    { id: 'uuid-a1', name: 'Compressor de Ar C-101', asset_tag: 'COMP-00101', location: 'Ala Norte - Produção', criticality: 5 },
    { id: 'uuid-a2', name: 'Forno Industrial F-01', asset_tag: 'FORN-0001', location: 'Prédio A, Sala 101', criticality: 5 },
    { id: 'uuid-a3', name: 'Esteira Transportadora E-22', asset_tag: 'EST-0022', location: 'Ala Norte - Produção', criticality: 3 },
    { id: 'uuid-a4', name: 'Empilhadeira Elétrica E-03', asset_tag: 'EMP-0003', location: 'Armazém Central', criticality: 2 },
]);

// Configuração das colunas da tabela
const tableColumns = ref([
  { key: 'name', title: 'Nome do Ativo', sortable: true },
  { key: 'asset_tag', title: 'Tag' },
  { key: 'location', title: 'Localização', sortable: true },
  { key: 'criticality', title: 'Criticidade', sortable: true, class: 'text-center' },
  { key: 'actions', title: 'Ações', class: 'text-end' }
]);

// Funções Auxiliares de Criticidade
function getCriticismLabel(value) {
    const labels = { 1: 'Mínimo', 2: 'Baixo', 3: 'Médio', 4: 'Alto', 5: 'Crítico' };
    return labels[value] || '';
}
function getCriticismColorClass(value) {
    const colors = { 1: 'bg-secondary', 2: 'bg-success', 3: 'bg-warning', 4: 'bg-primary', 5: 'bg-danger' };
    return colors[value] || 'bg-light';
}


// --- Funções de Navegação ---
function viewDetails(id) {
  router.push(`/assets/${id}`);
}

function goToCreateAsset() {
  router.push('/assets/new');
}

function goToEditAsset(id) {
  router.push(`/assets/${id}/edit`);
}
</script>


<style scoped>
/* Estilos similares a WorkOrdersView */
.assets-view { }
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}
.view-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}
.filter-card { margin-bottom: var(--spacing-6); }
.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-4);
  align-items: end;
}
.filter-form .form-group { display: flex; flex-direction: column; }
.filter-form label {
   font-size: var(--font-size-sm);
   font-weight: var(--font-weight-medium);
   margin-bottom: var(--spacing-1);
}
.filter-form input, .filter-form select {
   padding: var(--padding-input-medium);
   border: 1px solid var(--color-border-input);
   border-radius: var(--border-radius-medium);
   font-size: var(--font-size-sm);
}
.filter-form .base-button { height: 38px; padding-top: 0; padding-bottom: 0; }

/* Estilo para o ponto de criticidade */
.criticidade-dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: var(--spacing-2);
  vertical-align: middle;
}
/* Cores (ajustar conforme seus tokens) */
.bg-danger { background-color: var(--color-priority-1); }
.bg-warning { background-color: var(--color-priority-2); }
.bg-yellow-400 { background-color: var(--color-priority-3); }
.bg-success { background-color: var(--color-feedback-success); }
.bg-secondary { background-color: var(--color-gray-500); }

:deep(.base-table__body .base-button) {
    padding: 4px 8px;
    font-size: 12px;
}
</style>
