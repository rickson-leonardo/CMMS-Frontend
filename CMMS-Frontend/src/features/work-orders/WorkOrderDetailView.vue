/**
 * @file WorkOrderDetailView.vue
 * @description View para exibir os detalhes de uma Ordem de Serviço específica.
 * @path src/features/work-orders/WorkOrderDetailView.vue
 * @version 1.1.0 - Adiciona botão Editar
 * @date 2025-10-24
 */
<template>
  <div class="work-order-detail-view">
    <div class="header-section">
      <h1 class="view-title">Detalhes da OS: <span v-if="workOrder">#{{ workOrderIdShort }} - {{ workOrder.title }}</span></h1>
      <div> <!-- Wrapper para botões -->
        <!-- Botão Editar -->
        <BaseButton variant="primary" @click="goToEditWorkOrder" class="me-2">
            Editar OS
        </BaseButton>
        <BaseButton variant="secondary" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/></svg>
            Voltar para Lista
        </BaseButton>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      Carregando detalhes da Ordem de Serviço...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else-if="workOrder" class="details-grid">
        <!-- Coluna Esquerda: Informações Gerais -->
        <BaseCard class="info-card">
            <template #title>Informações Gerais</template>
             <ul class="details-list">
                 <li><strong>Status:</strong> <span :class="['status-badge', `status-${workOrder.status.toLowerCase().replace(/ /g, '_')}`]">{{ workOrder.status }}</span></li>
                 <li><strong>Prioridade:</strong> <span :class="['priority-badge', `priority-${workOrder.priority}`]">{{ workOrder.priority }} - {{ getPriorityLabel(workOrder.priority) }}</span></li>
                 <li><strong>Ativo:</strong> {{ workOrder.asset }}</li>
                 <li><strong>Atribuído a:</strong> {{ workOrder.assignedTo || 'Não atribuído' }}</li>
                 <li><strong>Criado em:</strong> {{ formatDate(workOrder.createdAt) }}</li>
             </ul>
        </BaseCard>

        <!-- Coluna Direita: Descrição e Outros Detalhes (com Abas) -->
        <BaseCard class="details-card">
             <h5>Descrição</h5>
             <p>{{ workOrder.description || 'Nenhuma descrição fornecida.' }}</p>
             <!-- Abas futuras aqui -->
        </BaseCard>
    </div>

  </div>
</template>

<script setup>
/**
 * @description Script setup para WorkOrderDetailView. Adiciona navegação para Editar.
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const route = useRoute();
const router = useRouter();

// Estado (manter como antes)
const isLoading = ref(true);
const workOrder = ref(null);
const error = ref(null);
const workOrderId = ref(route.params.id);
const workOrderIdShort = computed(() => workOrderId.value?.substring(0, 8) || '');

// Dados simulados (manter como antes)
const mockWorkOrders = {
  'uuid-1': { id: 'uuid-1', title: 'Verificar superaquecimento do motor', asset: 'Prensa P-05', assignedTo: null, status: 'Aguardando Aprovação', priority: 1, createdAt: '2025-10-24T14:10:00Z', description: 'O motor principal da prensa P-05 está apresentando superaquecimento após 1 hora de operação contínua. Necessário investigar a causa.' },
  'uuid-2': { id: 'uuid-2', title: 'Falha no sensor de pressão', asset: 'Compressor C-101', assignedTo: 'João Silva', status: 'Em Progresso', priority: 1, createdAt: '2025-10-24T11:30:00Z', description: 'Compressor parando intermitentemente com erro E-45 no painel.' },
};

onMounted(() => {
  fetchWorkOrderDetail();
});

// fetchWorkOrderDetail (manter como antes)
async function fetchWorkOrderDetail() {
  isLoading.value = true;
  error.value = null;
  await new Promise(resolve => setTimeout(resolve, 700));
  try {
      const data = mockWorkOrders[workOrderId.value];
      if (data) {
          workOrder.value = data;
      } else {
          throw new Error('Ordem de Serviço não encontrada.');
      }
  } catch (err) {
      error.value = `Não foi possível carregar os detalhes da OS ${workOrderIdShort.value}. ${err.message}`;
  } finally {
      isLoading.value = false;
  }
}

// goBack (manter como antes)
function goBack() {
  router.push('/work-orders');
}

// --- Nova Função de Navegação ---
function goToEditWorkOrder() {
  router.push(`/work-orders/${workOrderId.value}/edit`);
}


// Funções auxiliares (manter como antes)
function getPriorityLabel(priorityValue) { /* ... */ }
function formatDate(dateString) { /* ... */ }

</script>

<style scoped>
.work-order-detail-view {
  /* Layout da view de detalhe */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap; /* Permite quebra de linha em telas pequenas */
  gap: var(--spacing-4);
}

.view-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--color-text-default);
}
.view-title span {
  color: var(--color-text-muted); /* Destaca menos o ID */
}

.loading-state, .error-state {
  text-align: center;
  padding: var(--spacing-8);
  font-style: italic;
  color: var(--color-text-muted);
}
.error-state {
    color: var(--color-feedback-error);
    font-weight: var(--font-weight-medium);
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr; /* Default para mobile */
    gap: var(--spacing-6);
}

/* Layout de 2 colunas para telas maiores */
@media (min-width: 992px) { /* Breakpoint 'lg' do Bootstrap */
    .details-grid {
        grid-template-columns: 320px 1fr; /* Coluna fixa à esquerda */
    }
}

.info-card {
    /* Estilos específicos para o card de informações, se necessário */
    position: sticky; /* Mantém visível ao rolar */
    top: calc(var(--spacing-6) + 60px); /* Ajustar conforme altura do header */
}

.details-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.details-list li {
    padding: var(--spacing-2) 0;
    border-bottom: 1px solid var(--color-border-default);
    font-size: var(--font-size-sm);
}
.details-list li:last-child {
    border-bottom: none;
}
.details-list strong {
    display: inline-block;
    width: 90px; /* Alinha os valores */
    color: var(--color-text-muted);
    font-weight: var(--font-weight-medium);
}

/* Reutiliza estilos de badges de status e prioridade */
.status-badge, .priority-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  color: var(--color-white);
  white-space: nowrap;
  vertical-align: middle;
}
.status-aguardando_aprovação { background-color: var(--color-feedback-warning); color: var(--color-black) !important; }
.status-aberta { background-color: var(--color-interactive-primary); }
.status-em_progresso { background-color: var(--color-cyan-500, #06b6d4); color: var(--color-black) !important; }
.status-concluída { background-color: var(--color-feedback-success); }
.status-fechada { background-color: var(--color-gray-800); }
.status-em_espera { background-color: var(--color-gray-500); }

.priority-1 { background-color: var(--color-priority-1); }
.priority-2 { background-color: var(--color-priority-2); }
.priority-3 { background-color: var(--color-priority-3); color: var(--color-black) !important; }

.details-card h5 {
    margin-bottom: var(--spacing-4);
    font-weight: var(--font-weight-semibold);
}
.details-card p {
    line-height: 1.6;
}
</style>

