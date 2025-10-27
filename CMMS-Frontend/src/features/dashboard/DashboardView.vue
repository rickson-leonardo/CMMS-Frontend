<!-- CMMS-Frontend/src/features/dashboard/DashboardView.vue -->
<template>
  <div class="container-fluid p-4">
    <h1 class="h2 mb-4">Dashboard Gerencial</h1>

    <div v-if="isLoading" class="d-flex justify-content-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!isLoading && !error">
      <div class="row g-4">
        <div v-for="kpi in kpis" :key="kpi.id" class="col-12 col-sm-6 col-lg-3">
          <StatsCard :title="kpi.title" :value="kpi.value" :color="kpi.color" :icon="kpi.icon" />
        </div>
      </div>

      <div class="row mt-4 g-4">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-list-check me-2"></i>Ordens de Serviço Críticas
              </h5>
              <a href="#" class="btn btn-sm btn-outline-primary">Ver todas</a>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Título</th>
                      <th scope="col">Ativo</th>
                      <th scope="col">Status</th>
                      <th scope="col">Prioridade</th>
                      <th scope="col">Atribuído a</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in criticalWorkOrders" :key="order.id">
                      <td>
                        <strong>{{ order.title }}</strong>
                      </td>
                      <td>{{ order.asset }}</td>
                      <td>
                        <span :class="['badge', statusClass(order.status)]">{{
                          order.status
                        }}</span>
                      </td>
                      <td>
                        <span :class="['badge', priorityClass(order.priority)]">{{ order.priority }}</span>
                      </td>
                      <td>{{ order.assignedTo }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="bi bi-ticket me-2"></i>Tickets Recentes
              </h5>
              <a href="#" class="btn btn-sm btn-outline-primary">Ver todos</a>
            </div>
            <div class="list-group list-group-flush">
              <a v-for="ticket in recentTickets" :key="ticket.id" href="#"
                class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">{{ ticket.title }}</h6>
                  <small class="text-muted">{{
                    ticket.timeSinceCreation
                  }}</small>
                </div>
                <p class="mb-1 small">
                  Solicitante: {{ ticket.requester }}
                </p>
              </a>
              <a href="#" class="list-group-item list-group-item-action text-center">
                <strong>Ver todos os tickets</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';
import StatsCard from './components/StatsCard.vue';
import {
  dashboardService
} from './services/dashboardService';

const isLoading = ref(false);
const error = ref(null);
const kpis = ref([]);
const criticalWorkOrders = ref([]);
const recentTickets = ref([]);

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [summary, orders, tickets] = await Promise.all([
      dashboardService.getSummary(),
      dashboardService.getCriticalWorkOrders(),
      dashboardService.getRecentTickets(),
    ]);
    kpis.value = summary;
    criticalWorkOrders.value = orders;
    recentTickets.value = tickets;
  } catch (err) {
    error.value =
      'Falha ao carregar os dados do dashboard. Tente novamente mais tarde.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const statusClass = (status) => {
  const normalizedStatus = status.toLowerCase().replace(' ', '_');
  const statusMap = {
    awaiting_approval: 'status-awaiting_approval',
    open: 'status-open',
    in_progress: 'status-in_progress',
    on_hold: 'status-on_hold',
  };
  return statusMap[normalizedStatus] || 'bg-secondary';
};

const priorityClass = (priority) => {
  const priorityMap = {
    1: 'priority-1',
    2: 'priority-2',
    3: 'priority-3',
  };
  return priorityMap[priority] || 'bg-secondary';
};
</script>

<style scoped>
/* Adicionando as classes de status e prioridade globalmente,
   já que não temos um arquivo de estilos global sendo importado. */
:global(.status-awaiting_approval) {
  background-color: #ffc107 !important;
  color: #000 !important;
}

:global(.status-open) {
  background-color: #0d6efd !important;
}

:global(.status-in_progress) {
  background-color: #0dcaf0 !important;
  color: #000 !important;
}

:global(.status-on_hold) {
  background-color: #6c757d !important;
}

:global(.priority-1) {
  background-color: #dc3545 !important;
}

:global(.priority-2) {
  background-color: #fd7e14 !important;
}

:global(.priority-3) {
  background-color: #ffc107 !important;
  color: #000 !important;
}
</style>
