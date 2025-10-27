<!-- CMMS-Frontend/src/features/dashboard/components/StatsCard.vue -->
<template>
  <BaseCard class="kpi-card">
    <h6 class="kpi-title">{{ title }}</h6>
    <p class="kpi-value">{{ value }}</p>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/base/BaseCard.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
});
</script>

<style scoped>
.kpi-card {
  text-align: center;
}

:deep(.kpi-card .base-card__body) {
  padding: var(--spacing-6);
}

.kpi-title {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-interactive-primary);
  margin: 0;
  line-height: 1.1;
}
</style>
