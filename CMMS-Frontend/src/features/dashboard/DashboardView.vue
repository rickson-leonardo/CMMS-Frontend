/**
 * @file DashboardView.vue
 * @description View principal do Dashboard Gerencial. Exibe resumos e KPIs.
 * @path src/features/dashboard/DashboardView.vue
 * @version 1.1.0 - Utiliza BaseCard para estrutura
 * @date 2025-10-24
 */
<template>
  <div class="dashboard-view">
    <h1 class="dashboard-title">Dashboard Gerencial</h1>

    <!-- Secção de KPIs utilizando BaseCard -->
    <div class="kpi-section">
      <BaseCard class="kpi-card">
        <h6 class="kpi-title">OS Aguardando Aprovação</h6>
        <p class="kpi-value">4</p>
      </BaseCard>
      <BaseCard class="kpi-card">
        <h6 class="kpi-title">OS de Alta Prioridade</h6>
        <p class="kpi-value">2</p>
      </BaseCard>
      <BaseCard class="kpi-card">
        <h6 class="kpi-title">OS Em Progresso</h6>
        <p class="kpi-value">7</p>
      </BaseCard>
      <BaseCard class="kpi-card">
        <h6 class="kpi-title">Tickets Abertos</h6>
        <p class="kpi-value">12</p>
      </BaseCard>
    </div>

    <!-- Secção de Ordens de Serviço Críticas utilizando BaseCard -->
    <BaseCard title="Ordens de Serviço Críticas">
      <!-- Slot 'extra' para o link "Ver todas" -->
      <template #extra>
        <a href="#" class="view-all-link">Ver todas</a>
      </template>

      <!-- Conteúdo principal (futura tabela ou lista) -->
      <div>
        <p class="placeholder-text"><i>(Lista de OS críticas aparecerá aqui...)</i></p>
        <!-- Exemplo futuro: <WorkOrderList :items="criticalWorkOrders" /> -->
      </div>
    </BaseCard>

    <!-- Outras secções podem ser adicionadas aqui usando BaseCard -->

  </div>
</template>

<script setup>
/**
 * @description Script setup para o DashboardView.
 * Importa BaseCard e prepara para buscar dados.
 */
import { ref, onMounted } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue'; // Importa o BaseCard
// Futuramente importaremos serviços: import { dashboardService } from './services/dashboardService';

// Exemplo de como buscaríamos dados
const isLoading = ref(false);
const dashboardData = ref(null);
const criticalWorkOrders = ref([]); // Exemplo para a lista de OS

/*
onMounted(async () => {
  isLoading.value = true;
  try {
    // const summary = await dashboardService.getSummary();
    // dashboardData.value = summary;
    // criticalWorkOrders.value = await dashboardService.getCriticalWorkOrders();

    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 500));
    criticalWorkOrders.value = [ // Dados simulados para exemplo
        { id: 'uuid-1', title: 'Verificar superaquecimento', asset: 'Prensa P-05', status: 'Aguardando Aprovação', priority: 1 },
        { id: 'uuid-2', title: 'Falha no sensor', asset: 'Compressor C-101', status: 'Em Progresso', priority: 1 },
    ];
    console.log('Dados do dashboard carregados (simulado)');
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  } finally {
    isLoading.value = false;
  }
});
*/
</script>

<style scoped>
.dashboard-view {
  /* Mantém o padding do exemplo anterior */
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

/* Estilização específica para os cards de KPI */
.kpi-card {
  text-align: center;
}

/* :deep() é usado para estilizar conteúdo DENTRO do slot do BaseCard */
:deep(.kpi-card .base-card__body) {
  padding: var(--spacing-6); /* Ajusta padding se necessário */
}

.kpi-title {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm); /* Tamanho menor para o título do KPI */
  margin-bottom: var(--spacing-2); /* Menos espaço abaixo do título */
  text-transform: uppercase; /* Opcional: deixar em maiúsculas */
  letter-spacing: 0.5px; /* Opcional: espaçamento leve */
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-interactive-primary);
  margin: 0;
  line-height: 1.1; /* Ajusta a altura da linha para o número grande */
}

/* Estilo para o link "Ver todas" no slot extra */
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
  padding: var(--spacing-8) 0; /* Adiciona espaço vertical no placeholder */
  text-align: center;
}
</style>

