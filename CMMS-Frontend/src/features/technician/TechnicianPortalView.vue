/**
 * @file TechnicianPortalView.vue
 * @description View otimizada para técnicos, exibindo tarefas (OS) atribuídas
 * e permitindo a gestão rápida do seu trabalho diário.
 * @path src/features/technician/TechnicianPortalView.vue
 */
<template>
  <div class="technician-portal-view">
    <BaseHeader title="Portal do Técnico: Minhas Ordens de Serviço">
      <!-- Botão para alternar entre visualizações ou iniciar nova OS -->
      <BaseButton variant="secondary" icon-name="plus">
        Criar OS Rápida
      </BaseButton>
    </BaseHeader>

    <div class="p-6">
        <!-- Estatísticas Rápidas -->
        <div class="stats-grid mb-6">
            <BaseCard title="OS Abertas (Hoje)" class="stat-card">
                <p class="stat-value text-blue-600">3</p>
            </BaseCard>
            <BaseCard title="Em Progresso" class="stat-card">
                <p class="stat-value text-yellow-600">1</p>
            </BaseCard>
            <BaseCard title="Concluídas (Mês)" class="stat-card">
                <p class="stat-value text-green-600">18</p>
            </BaseCard>
            <BaseCard title="Tempo Médio OS" class="stat-card">
                <p class="stat-value text-red-600">1.5h</p>
            </BaseCard>
        </div>

        <!-- Tabela de Tarefas Atribuídas -->
        <BaseCard title="Minhas Tarefas Pendentes">
            <BaseTable
                :columns="osColumns"
                :data="assignedWorkOrders"
                empty-message="Parabéns! Nenhuma Ordem de Serviço pendente no momento."
            >
                <!-- Slot customizado para renderizar o Status -->
                <template #status-cell="{ item }">
                    <span :class="getStatusClass(item.status)">
                        {{ item.status_display }}
                    </span>
                </template>
                <!-- Slot customizado para Ações -->
                <template #actions-cell="{ item }">
                    <BaseButton variant="primary" size="small" @click="viewWorkOrder(item.id)">
                        Abrir
                    </BaseButton>
                </template>
            </BaseTable>
        </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseHeader from '@/components/base/BaseHeader.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';

const router = useRouter();

// Simulação de Dados de Ordens de Serviço Atribuídas
const assignedWorkOrders = ref([
    { id: 'wo-001', title: 'Falha do Motor M-102', asset: 'Motor M-102', priority: 5, status: 'open', status_display: 'Aberto', scheduled_start: 'Hoje, 08:00' },
    { id: 'wo-002', title: 'Manutenção Preventiva Semanal', asset: 'Linha de Produção 3', priority: 3, status: 'in_progress', status_display: 'Em Progresso', scheduled_start: 'Ontem, 14:00' },
    { id: 'wo-003', title: 'Substituição de filtro - AHU-05', asset: 'AHU-05', priority: 2, status: 'open', status_display: 'Aberto', scheduled_start: 'Amanhã, 10:00' },
]);

const osColumns = [
    { key: 'title', label: 'Título', isSortable: true },
    { key: 'asset', label: 'Ativo', isSortable: true },
    { key: 'scheduled_start', label: 'Agendado para', isSortable: true },
    { key: 'priority', label: 'Prioridade', isSortable: true },
    { key: 'status', label: 'Status', isSortable: true },
    { key: 'actions', label: 'Ações', isSortable: false },
];

/**
 * @function getStatusClass
 * @description Retorna as classes CSS para o status da OS.
 */
const getStatusClass = (status) => {
    switch (status) {
        case 'open':
            return 'status-badge status-open';
        case 'in_progress':
            return 'status-badge status-in-progress';
        case 'on_hold':
            return 'status-badge status-on-hold';
        case 'completed':
            return 'status-badge status-completed';
        default:
            return 'status-badge';
    }
};

/**
 * @function viewWorkOrder
 * @description Redireciona para a página de detalhes da Ordem de Serviço.
 */
const viewWorkOrder = (id) => {
    // Rota futura: /work-orders/:id
    console.log(`Navegando para detalhes da OS: ${id}`);
    router.push(`/work-orders/${id}`);
};
</script>

<style scoped>
/* Estilos para o painel de estatísticas */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-6);
}

.stat-card {
    text-align: center;
}

.stat-value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-2) 0 0 0;
}

/* Estilos de Badges (Copiar ou usar Tailwind no futuro) */
.status-badge {
    display: inline-block;
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
}

.status-open {
    background-color: var(--color-blue-100);
    color: var(--color-blue-700);
}
.status-in-progress {
    background-color: var(--color-yellow-100);
    color: var(--color-yellow-700);
}
.status-on-hold {
    background-color: var(--color-red-100);
    color: var(--color-red-700);
}
.status-completed {
    background-color: var(--color-green-100);
    color: var(--color-green-700);
}
</style>
