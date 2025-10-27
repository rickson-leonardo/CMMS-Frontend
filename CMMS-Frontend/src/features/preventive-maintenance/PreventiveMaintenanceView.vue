/**
 * @file PreventiveMaintenanceView.vue
 * @description View para listar e gerenciar planos de Manutenção Preventiva (PM).
 * @path src/features/preventive-maintenance/PreventiveMaintenanceView.vue
 * @version 1.0.1 - Corrige erro na inicialização dos dados simulados
 * @date 2025-10-24
 */
<template>
  <div class="pm-view">
    <div class="header-section">
      <h1 class="view-title">Planos de Manutenção Preventiva</h1>
      <BaseButton variant="primary" @click="goToCreatePM">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
        Novo Plano de PM
      </BaseButton>
    </div>

    <!-- Filtros -->
    <BaseCard class="mb-4 filter-card">
       <template #title>Filtros</template>
        <form class="filter-form row g-3 align-items-end">
            <div class="col-md-5">
                <BaseInput label="Buscar Ativo" placeholder="Nome, Tag..." />
            </div>
             <div class="col-md-4">
                <BaseSelect label="Localização" :options="[]" placeholder="Todas"/>
            </div>
            <div class="col-md-3">
                <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
            </div>
        </form>
    </BaseCard>

    <!-- Tabela -->
    <BaseCard>
       <BaseTable
        :items="mockPmSchedules"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        class="pm-table"
      >
        <template #cell-title="{ item, value }">
             <a href="#" @click.prevent="viewPmDetails(item.id)" class="fw-bold text-decoration-none">{{ value }}</a>
        </template>
        <template #cell-next_due_date="{ value, item }">
            <span :class="{'status-overdue': item.isOverdue}">{{ formatDate(value) }}</span>
        </template>
         <template #cell-status="{ value }">
            <span :class="['status-badge', value ? 'status-active' : 'status-inactive']">
                {{ value ? 'Ativo' : 'Inativo' }}
            </span>
         </template>
        <template #cell-actions="{ item }">
           <BaseButton variant="secondary" size="small" @click.stop="goToEditPM(item.id)" class="me-2">
             Editar
           </BaseButton>
           <BaseButton :variant="item.status ? 'danger' : 'success'" size="small" @click.stop="togglePmStatus(item.id)">
             {{ item.status ? 'Desativar' : 'Ativar' }}
           </BaseButton>
        </template>
        <template #empty>
          <div class="empty-state">Nenhum plano de PM encontrado.</div>
        </template>
       </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
/**
 * @description Script setup para PreventiveMaintenanceView. Lista planos de PM.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue'; // Placeholder filter
import BaseSelect from '@/components/base/BaseSelect.vue'; // Placeholder filter

const router = useRouter();
const isLoading = ref(false);

// Dados simulados INICIAIS (array puro)
const initialMockData = [
  { id: 'uuid-pm1', title: 'Inspeção e Limpeza de Filtros', asset: 'Compressor C-101', frequency: '30 dias', last_pm_date: '2025-09-15T00:00:00Z', next_due_date: '2025-10-15T00:00:00Z', status: true },
  { id: 'uuid-pm2', title: 'Calibração de Sensores', asset: 'Forno F-01', frequency: '6 meses', last_pm_date: '2025-06-30T00:00:00Z', next_due_date: '2025-12-30T00:00:00Z', status: true },
  { id: 'uuid-pm3', title: 'Lubrificação de Rolamentos', asset: 'Esteira E-22', frequency: '7 dias', last_pm_date: '2025-10-14T00:00:00Z', next_due_date: '2025-10-21T00:00:00Z', status: false }, // Inativo
];

// Calcula a propriedade 'isOverdue' ANTES de criar o ref
const processedMockData = initialMockData.map(pm => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(pm.next_due_date);
     // Ajusta para ignorar a hora e fuso horário na comparação da data
    dueDate.setUTCHours(0,0,0,0);
    today.setUTCHours(0,0,0,0);
    return {
        ...pm,
        isOverdue: pm.status && dueDate < today // Calcula se está vencido e ativo
    }
});

// Agora, cria o ref com os dados já processados
const mockPmSchedules = ref(processedMockData);


// Colunas da tabela
const tableColumns = ref([
  { key: 'title', title: 'Tarefa', sortable: true },
  { key: 'asset', title: 'Ativo', sortable: true },
  { key: 'frequency', title: 'Frequência' },
  { key: 'last_pm_date', title: 'Última Execução' },
  { key: 'next_due_date', title: 'Próximo Vencimento', sortable: true },
  { key: 'status', title: 'Status', class: 'text-center' },
  { key: 'actions', title: 'Ações', class: 'text-end' }
]);

// Funções Auxiliares
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
         // Usar UTC para evitar problemas de fuso horário apenas para exibição
        return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
    } catch (e) { return dateString; }
}

// Navegação e Ações (Placeholders)
function goToCreatePM() { console.log('Ir para criar PM'); /* router.push('/preventive-maintenance/new'); */ }
function goToEditPM(id) { console.log('Ir para editar PM:', id); /* router.push(`/preventive-maintenance/${id}/edit`); */ }
function viewPmDetails(id) { console.log('Ver detalhes PM:', id); /* router.push(`/preventive-maintenance/${id}`); */ }
function togglePmStatus(id) { console.log('Alternar status PM:', id); /* Chamar API e recarregar dados */ }

</script>

<style scoped>
/* Estilos gerais herdados */
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); flex-wrap: wrap; gap: var(--spacing-4);}
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.filter-card { margin-bottom: var(--spacing-6); }
.empty-state { text-align: center; padding: var(--spacing-8); color: var(--color-text-muted); }
.pm-table :deep(tbody tr) { cursor: pointer; }
.text-center { text-align: center; }
.text-end { text-align: right; }

.status-overdue {
    color: var(--color-feedback-error, #ef4444);
    font-weight: var(--font-weight-semibold, 600);
}
.status-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-medium);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
  white-space: nowrap;
}
.status-active { background-color: var(--color-feedback-success); color: var(--color-white); }
.status-inactive { background-color: var(--color-gray-500); color: var(--color-white); }

/* Ajuste fino na formatação da data para garantir consistência */
:deep(td) {
    white-space: nowrap;
}
</style>

