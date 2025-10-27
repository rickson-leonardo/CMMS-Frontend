/**
 * @file InventoryView.vue
 * @description View para listar e gerenciar peças do inventário.
 * @path src/features/inventory/InventoryView.vue
 * @version 1.0.1 - Corrige erro na inicialização dos dados simulados
 * @date 2025-10-24
 */
<template>
  <div class="inventory-view">
    <div class="header-section">
      <h1 class="view-title">Gestão de Inventário e Peças</h1>
      <div>
        <BaseButton variant="secondary" @click="showTransactionModal" class="me-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up me-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/></svg>
          Movimentação
        </BaseButton>
        <BaseButton variant="primary" @click="showPartModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
          Nova Peça
        </BaseButton>
      </div>
    </div>

    <!-- Filtros -->
    <BaseCard class="mb-4 filter-card">
       <template #title>Filtros</template>
        <form class="filter-form row g-3 align-items-end">
            <div class="col-md-6">
                <BaseInput label="Buscar Peça" placeholder="Nome, SKU..." />
            </div>
             <div class="col-md-4">
                <!-- Checkbox para estoque baixo seria ideal -->
             </div>
            <div class="col-md-2">
                <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
            </div>
        </form>
    </BaseCard>

    <!-- Tabela -->
    <BaseCard>
       <BaseTable
        :items="mockParts"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        class="inventory-table"
      >
        <template #cell-name="{ item, value }">
            <a href="#" @click.prevent="viewPartDetails(item.id)" class="fw-bold text-decoration-none">{{ value }}</a>
        </template>
        <template #cell-sku="{ value }">
            <code>{{ value }}</code>
        </template>
        <template #cell-quantity_on_hand="{ item, value }">
            <span :class="{'low-stock': item.isLowStock}">{{ value }}</span>
        </template>
        <template #cell-actions="{ item }">
           <BaseButton variant="secondary" size="small" @click.stop="showPartModal(item.id)">
             Editar
           </BaseButton>
           <!-- Botão de ver histórico pode ser adicionado aqui -->
        </template>
        <template #empty>
          <div class="empty-state">Nenhuma peça encontrada.</div>
        </template>
       </BaseTable>
    </BaseCard>

    <!-- Modais (placeholder) -->
    <!-- Modal para Nova Peça/Editar Peça -->
    <!-- Modal para Nova Movimentação -->

  </div>
</template>

<script setup>
/**
 * @description Script setup para InventoryView. Lista peças do inventário.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue'; // Placeholder filter
// import BaseSelect from '@/components/base/BaseSelect.vue'; // Placeholder filter (if needed)

const router = useRouter();
const isLoading = ref(false);

// Dados simulados INICIAIS (array puro)
const initialMockData = [
  { id: 'uuid-part1', name: 'Filtro de ar HEPA-250', sku: 'FA-HEPA-250', quantity_on_hand: 4, reorder_point: 5 },
  { id: 'uuid-part2', name: 'Rolamento 6203-2RS', sku: 'ROL-6203-2RS', quantity_on_hand: 25, reorder_point: 10 },
  { id: 'uuid-part3', name: 'Óleo Lubrificante Sintético ISO VG 46', sku: 'OLEO-SINT-46', quantity_on_hand: 12, reorder_point: 20 },
  { id: 'uuid-part4', name: 'Correia V-Belt A-36', sku: 'COR-A36', quantity_on_hand: 2, reorder_point: 5 },
];

// Calcula a propriedade 'isLowStock' ANTES de criar o ref
const processedMockData = initialMockData.map(part => ({
    ...part,
    isLowStock: part.quantity_on_hand < part.reorder_point
}));

// Agora, cria o ref com os dados já processados
const mockParts = ref(processedMockData);


// Colunas da tabela
const tableColumns = ref([
  { key: 'name', title: 'Nome da Peça', sortable: true },
  { key: 'sku', title: 'SKU / Part Number' },
  { key: 'quantity_on_hand', title: 'Qtd. Estoque', class: 'text-center' },
  { key: 'reorder_point', title: 'Ponto Reposição', class: 'text-center' },
  { key: 'actions', title: 'Ações', class: 'text-end' }
]);

// Funções de Navegação/Ação (Placeholders)
function viewPartDetails(id) { console.log('Ver detalhes peça:', id); /* router.push(`/inventory/${id}`); */ }
function showPartModal(id = null) { console.log('Abrir modal peça:', id); /* Lógica modal */ }
function showTransactionModal() { console.log('Abrir modal movimentação'); /* Lógica modal */ }

</script>

<style scoped>
/* Estilos gerais herdados */
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); flex-wrap: wrap; gap: var(--spacing-4);}
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.filter-card { margin-bottom: var(--spacing-6); }
.empty-state { text-align: center; padding: var(--spacing-8); color: var(--color-text-muted); }
.inventory-table :deep(tbody tr) { cursor: pointer; }
.text-center { text-align: center; }
.text-end { text-align: right; }

.low-stock {
    color: var(--color-feedback-error, #ef4444);
    font-weight: var(--font-weight-semibold, 600);
}

/* Adiciona estilo para a linha inteira quando estoque baixo */
:deep(.inventory-table tbody tr:has(.low-stock)) {
    background-color: var(--color-red-50, #fef2f2);
}
:deep(.inventory-table tbody tr:has(.low-stock):hover) {
    background-color: var(--color-red-100, #fee2e2) !important;
}

</style>

