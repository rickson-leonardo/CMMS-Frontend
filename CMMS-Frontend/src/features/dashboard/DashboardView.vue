<!-- CMMS-Frontend/src/features/dashboard/DashboardView.vue -->
<template>
  <div class="dashboard-view">
    <h1 class="dashboard-title">Dashboard Gerencial</h1>

    <div v-if="isLoading" class="loading-state">
      <p>Carregando...</p>
    </div>
    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-if="!isLoading && !error" class="dashboard-content">
      <div class="kpi-section">
        <StatsCard v-for="kpi in kpis" :key="kpi.id" :title="kpi.title" :value="kpi.value" />
      </div>

      <BaseCard title="Ordens de Serviço Críticas">
        <template #extra>
          <a href="#" class="view-all-link">Ver todas</a>
        </template>
        <div>
          <ul v-if="criticalWorkOrders.length" class="work-order-list">
            <li v-for="order in criticalWorkOrders" :key="order.id">
              <strong>{{ order.title }}</strong> em {{ order.asset }} - Status: {{ order.status }}
            </li>
          </ul>
          <p v-else class="placeholder-text">
            Nenhuma ordem de serviço crítica.
          </p>
        </div>
      </BaseCard>

      <MaintenanceChart />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';
import StatsCard from './components/StatsCard.vue';
import MaintenanceChart from './components/MaintenanceChart.vue';
import {
  dashboardService
} from './services/dashboardService';

const isLoading = ref(false);
const error = ref(null);
const kpis = ref([]);
const criticalWorkOrders = ref([]);

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [summary, orders] = await Promise.all([
      dashboardService.getSummary(),
      dashboardService.getCriticalWorkOrders(),
    ]);
    kpis.value = summary;
    criticalWorkOrders.value = orders;
  } catch (err) {
    error.value =
      'Falha ao carregar os dados do dashboard. Tente novamente mais tarde.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.dashboard-view {
  padding: var(--spacing-6);
}

.dashboard-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-6);
  color: var(--color-text-default);
}

.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.view-all-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-link);
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.placeholder-text {
  color: var(--color-text-muted);
  padding: var(--spacing-8) 0;
  text-align: center;
}

.work-order-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.work-order-list li {
  padding: var(--spacing-2) 0;
  border-bottom: 1px solid var(--color-border-default);
}

.work-order-list li:last-child {
  border-bottom: none;
}
</style>
