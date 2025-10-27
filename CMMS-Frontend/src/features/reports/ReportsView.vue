/**
 * @file ReportsView.vue
 * @description View para exibir relatórios e KPIs gerenciais.
 * @path src/features/reports/ReportsView.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="reports-view">
    <div class="header-section">
      <h1 class="view-title">Relatórios Gerenciais e KPIs</h1>
       <div class="col-md-3"> <!-- Placeholder para filtro de período -->
            <BaseSelect label="Período" :options="periodOptions" v-model="selectedPeriod"/>
        </div>
    </div>

    <!-- Abas para diferentes categorias de relatórios -->
    <!-- Implementação de abas (ex: BaseTabs) viria aqui -->
    <div class="tabs-placeholder mb-4">
        <!-- Botões simulando abas -->
        <BaseButton variant="primary" class="me-2">Visão Geral</BaseButton>
        <BaseButton variant="secondary" class="me-2">Análise de Ativos</BaseButton>
        <BaseButton variant="secondary">Performance da Equipe</BaseButton>
    </div>


    <!-- Conteúdo da Aba Ativa (Visão Geral como exemplo) -->
    <div class="report-content">
        <div class="row g-4">
            <!-- KPIs -->
            <div class="col-lg-3 col-md-6">
                <BaseCard class="kpi-card text-center">
                    <div class="kpi-value display-5 fw-bold">4.2h</div>
                    <div class="kpi-label text-muted">MTTR</div>
                </BaseCard>
            </div>
             <div class="col-lg-3 col-md-6">
                <BaseCard class="kpi-card text-center">
                    <div class="kpi-value display-5 fw-bold">120d</div>
                    <div class="kpi-label text-muted">MTBF</div>
                </BaseCard>
            </div>
             <div class="col-lg-3 col-md-6">
                <BaseCard class="kpi-card text-center">
                    <div class="kpi-value display-5 fw-bold">92%</div>
                    <div class="kpi-label text-muted">PM Compliance</div>
                </BaseCard>
            </div>
            <div class="col-lg-3 col-md-6">
                <BaseCard class="kpi-card text-center">
                    <div class="kpi-value display-5 fw-bold">142</div>
                    <div class="kpi-label text-muted">OS Concluídas</div>
                </BaseCard>
            </div>

            <!-- Gráficos -->
            <div class="col-lg-6">
                <BaseCard>
                    <template #title>OS por Status</template>
                    <div class="chart-placeholder">[Gráfico de Pizza/Donut aqui]</div>
                </BaseCard>
            </div>
             <div class="col-lg-6">
                <BaseCard>
                     <template #title>OS por Prioridade</template>
                     <div class="chart-placeholder">[Gráfico de Barras aqui]</div>
                </BaseCard>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
/**
 * @description Script setup para ReportsView. Exibe KPIs e placeholders para gráficos.
 */
import { ref } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseSelect from '@/components/base/BaseSelect.vue'; // Placeholder filter
// Futuramente: import ChartComponent from '@/components/common/ChartComponent.vue';

const selectedPeriod = ref('30'); // Valor padrão para filtro de período
const periodOptions = ref([ // Opções para filtro de período
    { label: 'Últimos 30 dias', value: '30' },
    { label: 'Últimos 90 dias', value: '90' },
    { label: 'Este Mês', value: 'month' },
    { label: 'Este Ano', value: 'year' },
]);

</script>

<style scoped>
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); flex-wrap: wrap; gap: var(--spacing-4);}
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.tabs-placeholder { /* Apenas para visualização */
    border-bottom: 1px solid var(--color-border-default);
    padding-bottom: var(--spacing-4);
}
.kpi-card {
    padding: var(--spacing-4);
}
.kpi-value {
    color: var(--color-interactive-primary);
    margin-bottom: var(--spacing-1);
}
.kpi-label {
    font-size: var(--font-size-sm);
}
.chart-placeholder {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-background-muted);
    color: var(--color-text-muted);
    border-radius: var(--border-radius-medium);
    font-style: italic;
}
</style>
