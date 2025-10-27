/**
 * @file WorkOrdersView.vue
 * @description View para listar e filtrar Ordens de Serviço.
 * @path src/features/work-orders/WorkOrdersView.vue
 * @version 1.1.0 - Adiciona botões Novo/Editar e navegação
 * @date 2025-10-24
 */
<template>
  <div class="work-orders-view">
    <div class="header-section">
      <h1 class="view-title">Ordens de Serviço</h1>
      <!-- Botão Novo -->
      <BaseButton variant="primary" @click="goToCreateWorkOrder">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
        Nova OS
      </BaseButton>
    </div>

    <!-- Card de Filtros (Conteúdo do filtro omitido por brevidade) -->
    <BaseCard class="mb-4 filter-card">
      <template #title>Filtros</template>
      <form class="filter-form row g-3 align-items-end">
        <div class="col-md-4">
          <BaseInput label="Buscar" placeholder="Título, Ativo..." />
        </div>
         <div class="col-md-3">
             <BaseSelect label="Status" :options="[]" placeholder="Todos"/>
         </div>
         <div class="col-md-3">
             <BaseSelect label="Prioridade" :options="[]" placeholder="Todas"/>
         </div>
         <div class="col-md-2">
            <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
         </div>
      </form>
    </BaseCard>

    <!-- Card da Tabela -->
    <BaseCard>
      <BaseTable
        :items="mockWorkOrders"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        @sort="handleTableSort"
        class="work-orders-table"
      >
        <!-- Customização das Células -->
        <template #cell-status="{ value }">
          <span :class="['status-badge', `status-${value.toLowerCase().replace(' ', '_')}`]">
            {{ value }}
          </span>
        </template>

        <template #cell-priority="{ value }">
           <span :class="['priority-badge', `priority-${value}`]">
             {{ value }} - {{ getPriorityLabel(value) }}
          </span>
        </template>

        <template #cell-actions="{ item }">
          <!-- Botão Editar na Tabela -->
          <BaseButton variant="secondary" size="small" @click.stop="goToEditWorkOrder(item.id)" class="me-2">
            Editar
          </BaseButton>
          <BaseButton variant="text" size="small" @click.stop="viewDetails(item.id)">
            Detalhes
          </BaseButton>
        </template>

         <template #cell-title="{ item, value }">
            <a href="#" @click.prevent="viewDetails(item.id)" class="fw-bold text-decoration-none">{{ value }}</a>
        </template>

        <!-- Placeholder para quando não há dados -->
        <template #empty>
          <div class="empty-state">Nenhuma Ordem de Serviço encontrada.</div>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
/**
 * @description Script setup para WorkOrdersView. Inclui dados simulados,
 * configuração da tabela e funções de navegação.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Importa useRouter
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseButton from '@/components/base/BaseButton.vue';
// Placeholders para filtros
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';

const router = useRouter(); // Inicializa o router

// Estado
const isLoading = ref(false);
// Dados simulados (Manter como antes)
const mockWorkOrders = ref([
    { id: 'uuid-1', title: 'Verificar superaquecimento do motor', asset: 'Prensa P-05', assignedTo: null, status: 'Aguardando Aprovação', priority: 1, createdAt: '2025-10-24T14:10:00Z' },
    { id: 'uuid-2', title: 'Falha no sensor de pressão', asset: 'Compressor C-101', assignedTo: 'João Silva', status: 'Em Progresso', priority: 1, createdAt: '2025-10-24T11:30:00Z' },
    { id: 'uuid-3', title: 'Ruído incomum na esteira', asset: 'Esteira E-22', assignedTo: null, status: 'Aberta', priority: 2, createdAt: '2025-10-23T17:00:00Z' },
    { id: 'uuid-4', title: 'Manutenção preventiva semanal', asset: 'Forno F-01', assignedTo: 'Ana Souza', status: 'Aberta', priority: 3, createdAt: '2025-10-23T09:00:00Z'},
    { id: 'uuid-5', title: 'Troca de filtro', asset: 'Sistema Exaustão S-03', assignedTo: 'Carlos Pereira', status: 'Concluída', priority: 3, createdAt: '2025-10-20T10:25:00Z'},
]);

// Configuração das colunas da tabela
const tableColumns = ref([
  { key: 'title', title: 'Título', sortable: true },
  { key: 'asset', title: 'Ativo', sortable: true },
  { key: 'assignedTo', title: 'Atribuído a' },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'priority', title: 'Prioridade', sortable: true },
  { key: 'createdAt', title: 'Data Criação' },
  { key: 'actions', title: 'Ações', class: 'text-end' } // Adiciona coluna de ações
]);

// Funções Auxiliares (Manter como antes)
function getPriorityLabel(priorityValue) {
  const labels = { 1: 'Alta', 2: 'Média', 3: 'Normal' };
  return labels[priorityValue] || '';
}
function formatDate(dateString) {
    // Implementação simples, idealmente usar uma lib como date-fns
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'});
    } catch(e) { return dateString; }
}

// Lógica de Ordenação (Manter como antes)
function handleTableSort({ key, order }) {
  console.log(`Ordenar por ${key} em ordem ${order}`);
  // Lógica de ordenação local (exemplo)
  mockWorkOrders.value.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      // Tratamento básico para strings e números
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return order === 'ascend' ? -1 : 1;
      if (valA > valB) return order === 'ascend' ? 1 : -1;
      return 0;
  });
}

// --- Funções de Navegação ---
function viewDetails(id) {
  console.log('Navegar para detalhes da OS:', id);
  router.push(`/work-orders/${id}`);
}

function goToCreateWorkOrder() {
  console.log('Navegar para criar nova OS');
  router.push('/work-orders/new');
}

function goToEditWorkOrder(id) {
  console.log('Navegar para editar OS:', id);
  router.push(`/work-orders/${id}/edit`);
}

</script>

<style scoped>
.work-orders-view {
  /* Layout geral da view */
}

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
  color: var(--color-text-default);
}

.filter-card {
  margin-bottom: var(--spacing-6);
}

/* Estilo para o formulário de filtros */
.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-4);
  align-items: end; /* Alinha itens na base */
}

/* Estilos básicos para inputs/selects placeholders */
.filter-form .form-group {
  display: flex;
  flex-direction: column;
}
.filter-form label {
   font-size: var(--font-size-sm);
   font-weight: var(--font-weight-medium);
   margin-bottom: var(--spacing-1);
   color: var(--color-text-label);
}
.filter-form input, .filter-form select {
   padding: var(--padding-input-medium);
   border: 1px solid var(--color-border-input);
   border-radius: var(--border-radius-medium);
   font-size: var(--font-size-sm);
}
/* Estilo para o botão de filtro */
.filter-form .base-button {
    height: 38px; /* Ajusta altura para alinhar com inputs/selects */
    padding-top: 0;
    padding-bottom: 0;
}


/* Badges de Status (reutiliza classes definidas globalmente ou aqui) */
.status-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem; /* --font-size-xs */
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  color: var(--color-white); /* Cor padrão do texto */
  white-space: nowrap;
}

.status-aguardando_aprovação { background-color: var(--color-feedback-warning); color: var(--color-black) !important; }
.status-aberta { background-color: var(--color-interactive-primary); }
.status-em_progresso { background-color: var(--color-cyan-500, #06b6d4); color: var(--color-black) !important; } /* Exemplo de cor Ciano */
.status-concluída { background-color: var(--color-feedback-success); }
.status-fechada { background-color: var(--color-gray-800); }
.status-em_espera { background-color: var(--color-gray-500); }


/* Badges de Prioridade (usando vars ou classes diretas) */
.priority-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-medium);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  white-space: nowrap;
}
.priority-1 { background-color: var(--color-priority-1); }
.priority-2 { background-color: var(--color-priority-2); }
.priority-3 { background-color: var(--color-priority-3); color: var(--color-black) !important; }


/* Garante que o BaseButton na célula de ações seja pequeno */
:deep(.base-table__body .base-button) {
    /* Estilos se BaseButton não tiver prop 'size' ainda */
    padding: 4px 8px;
    font-size: 12px;
}
</style>
