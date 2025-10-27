/**
 * @file TicketDetailView.vue
 * @description View para exibir os detalhes de um Ticket específico.
 * @path src/features/tickets/TicketDetailView.vue
 * @version 1.1.0 - Adiciona botão Editar
 * @date 2025-10-24
 */
<template>
 <div class="ticket-detail-view">
    <div class="header-section">
      <h1 class="view-title">Detalhes do Ticket: <span v-if="ticket">#{{ ticketIdShort }} - {{ ticket.title }}</span></h1>
       <div> <!-- Wrapper para botões -->
         <!-- Botão Editar -->
        <BaseButton variant="primary" @click="goToEditTicket" class="me-2">
            Editar Ticket
        </BaseButton>
        <BaseButton variant="secondary" @click="goBack">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/></svg>
           Voltar para Lista
        </BaseButton>
       </div>
    </div>

     <div v-if="isLoading" class="loading-state">
      Carregando detalhes do Ticket...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else-if="ticket" class="details-grid">
      <!-- Coluna Esquerda: Informações Gerais -->
       <BaseCard class="info-card">
           <template #title>Informações Gerais</template>
            <ul class="details-list">
                 <li><strong>Status:</strong> <span :class="['status-badge', `status-${ticket.status.toLowerCase()}`]">{{ getStatusLabel(ticket.status) }}</span></li>
                 <li><strong>Solicitante:</strong> {{ ticket.requester || '-' }}</li>
                 <li><strong>Ativo:</strong> {{ ticket.asset || '-' }}</li>
                 <li><strong>Criado em:</strong> {{ formatDate(ticket.createdAt) }}</li>
            </ul>
            <!-- Ações contextuais (ex: Criar OS a partir do Ticket) podem vir aqui -->
       </BaseCard>

       <!-- Coluna Direita: Descrição e Histórico -->
       <BaseCard class="details-card">
            <h5>Descrição Original</h5>
            <p>{{ ticket.description || 'Nenhuma descrição fornecida.' }}</p>
            <hr class="my-4">
            <h5>Histórico / Comentários</h5>
            <p class="text-muted">Nenhum comentário adicionado ainda.</p>
       </BaseCard>
    </div>
 </div>
</template>

<script setup>
/**
 * @description Script setup para TicketDetailView. Busca dados do Ticket
 * com base no ID da rota e exibe os detalhes. Adiciona navegação para Editar.
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(true);
const ticket = ref(null);
const error = ref(null);
const ticketId = ref(route.params.id);
const ticketIdShort = computed(() => ticketId.value?.substring(0, 8) || '');

// Dados simulados
const mockTickets = {
    'uuid-t1': { id: 'uuid-t1', title: 'Painel da IHM não responde', asset: 'Prensa P-05', requester: 'Roberto Andrade', status: 'pending', createdAt: '2025-10-24T08:15:00Z', description: 'O painel touch screen da prensa P-05 travou e não aceita comandos.' },
    'uuid-t2': { id: 'uuid-t2', title: 'Luz de emergência piscando', asset: 'Painel Elétrico PE-03', requester: 'Lúcia Martins', status: 'open', createdAt: '2025-10-24T10:00:00Z', description: 'A luz vermelha de emergência do painel PE-03 está piscando rapidamente.' },
};

onMounted(() => {
  fetchTicketDetail();
});

// Função para buscar dados do Ticket (simulada)
async function fetchTicketDetail() {
  isLoading.value = true;
  error.value = null;
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
      const data = mockTickets[ticketId.value];
      if (data) {
          ticket.value = data;
      } else {
          throw new Error('Ticket não encontrado.');
      }
  } catch (err) {
      error.value = `Não foi possível carregar os detalhes do Ticket ${ticketIdShort.value}. ${err.message}`;
  } finally {
      isLoading.value = false;
  }
}

// Função para voltar à lista
function goBack() {
  router.push('/tickets');
}

// --- Nova Função de Navegação ---
function goToEditTicket() {
    router.push(`/tickets/${ticketId.value}/edit`);
}


// Funções auxiliares (copiadas de TicketsView)
function getStatusLabel(statusValue) { /* ... */ }
function formatDate(dateString) { /* ... */ }

</script>

<style scoped>
/* Estilos similares às outras views de detalhe */
.ticket-detail-view { }
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.view-title span { color: var(--color-text-muted); }

.loading-state, .error-state { text-align: center; padding: var(--spacing-8); font-style: italic; color: var(--color-text-muted); }
.error-state { color: var(--color-feedback-error); font-weight: var(--font-weight-medium); }

.details-grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-6); }
@media (min-width: 992px) { .details-grid { grid-template-columns: 320px 1fr; } }

.info-card { position: sticky; top: calc(var(--spacing-6) + 60px); }

.details-list { list-style: none; padding: 0; margin: 0; }
.details-list li { padding: var(--spacing-2) 0; border-bottom: 1px solid var(--color-border-default); font-size: var(--font-size-sm); }
.details-list li:last-child { border-bottom: none; }
.details-list strong { display: inline-block; width: 90px; color: var(--color-text-muted); font-weight: var(--font-weight-medium); }

/* Badges de Status (Ticket) */
.status-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
  color: var(--color-white);
  white-space: nowrap;
  vertical-align: middle;
}
.ticket-status-aberto { background-color: var(--color-interactive-primary); }
.ticket-status-pendente { background-color: var(--color-feedback-warning); color: var(--color-black) !important; }
.ticket-status-resolvido { background-color: var(--color-feedback-success); }
.ticket-status-fechado { background-color: var(--color-gray-500); }

.details-card h5 { margin-bottom: var(--spacing-3); font-weight: var(--font-weight-semibold); }
.description-box {
    background-color: var(--color-background-muted);
    padding: var(--spacing-3);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--color-border-default);
    white-space: pre-wrap; /* Preserva quebras de linha da descrição */
    font-size: var(--font-size-sm);
    max-height: 200px; /* Limita altura se for muito longo */
    overflow-y: auto;
}
</style>

