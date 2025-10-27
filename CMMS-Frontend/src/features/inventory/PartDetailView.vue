/**
 * @file PartDetailView.vue
 * @description View para exibir os detalhes de uma peça específica do inventário,
 * incluindo informações básicas e histórico de movimentação.
 * @path src/features/inventory/PartDetailView.vue
 */
<template>
  <div class="part-detail-view">
    <!-- Header e Breadcrumb (Simulado) -->
    <BaseHeader :title="partName">
      <template #extra>
        <div class="flex items-center space-x-2">
          <BaseButton variant="secondary" icon-name="pencil">
            Editar Peça
          </BaseButton>
          <BaseButton variant="success" icon-name="truck">
            Nova Transação
          </BaseButton>
        </div>
      </template>
    </BaseHeader>

    <div class="p-6">
      <!-- Painel de Detalhes Principais -->
      <div class="details-grid">
        <BaseCard title="Informações Básicas" class="col-span-1">
          <p class="detail-item"><strong>SKU/Part No:</strong> <span class="detail-value">{{ part.sku }}</span></p>
          <p class="detail-item"><strong>Fornecedor Principal:</strong> <span class="detail-value">{{ part.supplier }}</span></p>
          <p class="detail-item"><strong>Preço Unitário:</strong> <span class="detail-value">{{ part.price }}</span></p>
          <p class="detail-item"><strong>Ativo Vinculado (Ex):</strong> <span class="detail-value">{{ part.asset_example }}</span></p>
        </BaseCard>

        <!-- Painel de Estoque -->
        <BaseCard title="Status do Estoque" class="col-span-1">
          <div class="stock-info">
            <div class="stock-item">
              <span class="stock-label">Estoque Atual</span>
              <span class="stock-value text-blue-600">{{ part.current_stock }}</span>
            </div>
            <div class="stock-item">
              <span class="stock-label">Ponto de Reabastecimento</span>
              <span class="stock-value text-yellow-600">{{ part.reorder_point }}</span>
            </div>
            <div class="stock-item">
              <span class="stock-label">Localização Principal</span>
              <span class="stock-value text-green-600">{{ part.main_location }}</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Área de Tabs para Histórico e Uso -->
      <BaseTabs :tabs="tabs" @tab-change="handleTabChange" class="mt-6">
        <template #tab-1>
          <!-- Tabela de Histórico de Transações -->
          <BaseTable
            :columns="historyColumns"
            :data="transactionHistory"
            empty-message="Nenhuma transação de inventário registrada para esta peça."
            class="mt-4"
          />
        </template>
        <template #tab-2>
          <p class="text-gray-600 mt-4">Visualização de Ordens de Serviço (OS) onde esta peça foi utilizada...</p>
          <!-- Tabela futura de Uso em OS -->
        </template>
      </BaseTabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTabs from '@/components/base/BaseTabs.vue'; // Componente BaseTabs é necessário
import BaseTable from '@/components/base/BaseTable.vue'; // Componente BaseTable é necessário

const route = useRoute();
const partId = computed(() => route.params.id);

// Simulação de Dados da Peça
const partData = {
    id: partId.value,
    name: `Válvula Solenoide (ID: ${partId.value.substring(0, 8)})`,
    sku: 'VS-1024-C',
    supplier: 'Automatiza Componentes',
    price: 'R$ 150,00',
    current_stock: 42,
    reorder_point: 15,
    main_location: 'Almoxarifado Prateleira 3B',
    asset_example: 'Máquina CNC-01 (Area A)',
};
const part = ref(partData);
const partName = computed(() => `Detalhes da Peça: ${part.value.name}`);

// Configuração das Abas
const tabs = [
    { id: 1, label: 'Histórico de Transações' },
    { id: 2, label: 'Uso em Ordens de Serviço' },
];

const handleTabChange = (tabId) => {
    console.log('Aba selecionada:', tabId);
    // Lógica para carregar dados diferentes com base na aba (ex: carregar histórico de OS)
};

// Dados e Colunas do Histórico de Transações (Simulado)
const historyColumns = [
    { key: 'date', label: 'Data', isSortable: true },
    { key: 'type', label: 'Tipo', isSortable: true },
    { key: 'quantity', label: 'Quantidade', isSortable: true },
    { key: 'source', label: 'Origem/Destino', isSortable: false },
    { key: 'user', label: 'Usuário', isSortable: false },
];

const transactionHistory = ref([
    { id: 1, date: '2025-10-20', type: 'ENTRADA (Compra)', quantity: '+50', source: 'Nota Fiscal 456', user: 'Admin' },
    { id: 2, date: '2025-10-21', type: 'SAÍDA (OS #102)', quantity: '-5', source: 'Máquina CNC-01', user: 'Téc. João' },
    { id: 3, date: '2025-10-22', type: 'ENTRADA (Ajuste)', quantity: '+2', source: 'Contagem de Estoque', user: 'Admin' },
]);
</script>

<style scoped>
.part-detail-view {
  /* O BaseHeader já injeta padding/margin, o resto é dentro da div.p-6 */
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-6);
    margin-bottom: var(--spacing-6);
}

.detail-item {
    padding: var(--spacing-1) 0;
    border-bottom: 1px dashed var(--color-border-subtle);
    font-size: var(--font-size-md);
    color: var(--color-text-default);
}

.detail-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.detail-value {
    float: right;
    font-weight: var(--font-weight-medium);
    color: var(--color-text-default);
}

.stock-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
}

.stock-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-2) 0;
    border-bottom: 1px dashed var(--color-border-subtle);
}

.stock-item:last-child {
    border-bottom: none;
}

.stock-label {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
}

.stock-value {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
}
</style>
