/**
 * @file TicketsView.vue
 * @description View para listar e filtrar Tickets.
 * @path src/features/tickets/TicketsView.vue
 * @version 1.1.0 - Adiciona botões Novo/Editar e navegação
 * @date 2025-10-24
 */
<template>
  <div class="tickets-view">
    <div class="header-section">
      <h1 class="view-title">Gestão de Tickets</h1>
       <!-- Botão Novo -->
      <BaseButton variant="primary" @click="goToCreateTicket">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
        Novo Ticket
      </BaseButton>
    </div>

    <!-- Card de Filtros -->
    <BaseCard class="mb-4 filter-card">
       <template #title>Filtros</template>
       <form class="filter-form row g-3 align-items-end">
         <div class="col-md-4">
           <BaseInput label="Buscar" placeholder="Título, Solicitante..." />
         </div>
          <div class="col-md-3">
              <BaseSelect label="Status" :options="[]" placeholder="Todos"/>
          </div>
          <div class="col-md-3">
              <BaseSelect label="Ativo" :options="[]" placeholder="Todos"/>
          </div>
          <div class="col-md-2">
             <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
          </div>
       </form>
    </BaseCard>

    <!-- Card da Tabela -->
    <BaseCard>
      <BaseTable
        :items="mockTickets"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        class="tickets-table"
      >
        <!-- Customização das Células -->
        <template #cell-title="{ item, value }">
             <a href="#" @click.prevent="viewDetails(item.id)" class="fw-bold text-decoration-none">{{ value }}</a>
        </template>

        <template #cell-status="{ value }">
          <span :class="['status-badge', `status-${value.toLowerCase()}`]">
            {{ getStatusLabel(value) }}
          </span>
        </template>

        <template #cell-actions="{ item }">
          <!-- Botão Editar na Tabela -->
           <BaseButton variant="secondary" size="small" @click.stop="goToEditTicket(item.id)" class="me-2">
             Editar
           </BaseButton>
           <BaseButton variant="text" size="small" @click.stop="viewDetails(item.id)">
             Detalhes
           </BaseButton>
        </template>

        <template #empty>
          <div class="empty-state">Nenhum Ticket encontrado.</div>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
/**
 * @description Script setup para TicketsView. Inclui dados simulados,
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
const mockTickets = ref([
    { id: 'uuid-t1', title: 'Painel da IHM não responde', asset: 'Prensa P-05', requester: 'Roberto Andrade', status: 'pending', createdAt: '2025-10-24T08:15:00Z' },
    { id: 'uuid-t2', title: 'Luz de emergência piscando', asset: 'Painel Elétrico PE-03', requester: 'Lúcia Martins', status: 'open', createdAt: '2025-10-24T10:00:00Z' },
    { id: 'uuid-t3', title: 'Vazamento na Bomba B-52', asset: 'Bomba B-52', requester: 'Carlos Pereira', status: 'resolved', createdAt: '2025-10-22T16:30:00Z' },
    { id: 'uuid-t4', title: 'Porta do almoxarifado emperrada', asset: null, requester: 'Fernando Costa', status: 'closed', createdAt: '2025-10-20T11:00:00Z' },
]);

// Configuração das colunas da tabela
const tableColumns = ref([
  { key: 'title', title: 'Título', sortable: true },
  { key: 'asset', title: 'Ativo' },
  { key: 'requester', title: 'Solicitante', sortable: true },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'createdAt', title: 'Data Criação' },
  { key: 'actions', title: 'Ações', class: 'text-end' }
]);

// Funções Auxiliares
function getStatusLabel(statusValue) {
    const labels = { open: 'Aberto', pending: 'Pendente', resolved: 'Resolvido', closed: 'Fechado' };
    return labels[statusValue] || statusValue;
}
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    } catch (e) { return dateString; }
}


// --- Funções de Navegação ---
function viewDetails(id) {
  router.push(`/tickets/${id}`);
}

function goToCreateTicket() {
  router.push('/tickets/new');
}

function goToEditTicket(id) {
  router.push(`/tickets/${id}/edit`);
}

</script>

<style scoped>
/* Estilos similares a WorkOrdersView e AssetsView */
.tickets-view { }
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

/* Badges de Status específicos para Tickets */
.status-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem; /* --font-size-xs */
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize; /* Diferente das OS, não capitalizado */
  color: var(--color-white); /* Cor padrão do texto */
  white-space: nowrap;
}

.ticket-status-aberto { background-color: var(--color-interactive-primary); }
.ticket-status-pendente { background-color: var(--color-feedback-warning); color: var(--color-black) !important; }
.ticket-status-resolvido { background-color: var(--color-feedback-success); }
.ticket-status-fechado { background-color: var(--color-gray-500); }

:deep(.base-table__body .base-button) {
    padding: 4px 8px;
    font-size: 12px;
}
</style>
