<!-- CMMS-Frontend/src/features/dashboard/components/MaintenanceChart.vue -->
<template>
  <BaseCard title="Manutenção Preventiva vs. Corretiva">
    <div class="placeholder-text">
      <i>(Gráfico de manutenção aparecerá aqui...)</i>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/base/BaseCard.vue';
</script>

<style scoped>
.placeholder-text {
  color: var(--color-text-muted);
  padding: var(--spacing-8) 0;
  text-align: center;
}
</style>
