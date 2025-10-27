<!-- CMMS-Frontend/src/features/dashboard/components/StatsCard.vue -->
<template>
  <div :class="['card', 'stat-card', colorClass]">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <h6 class="card-title text-uppercase">{{ title }}</h6>
        <p class="display-4">{{ value }}</p>
      </div>
      <i :class="['bi', iconClass]"></i>
    </div>
  </div>
</template>

<script setup>
import {
  computed
} from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  icon: {
    type: String,
    required: true,
  },
});

const colorClass = computed(() => `bg-${props.color}`);
const iconClass = computed(() => `bi-${props.icon}`);
</script>

<style scoped>
.stat-card {
  color: white;
}

.stat-card .display-4 {
  font-weight: 700;
}

.stat-card i {
  font-size: 4rem;
  opacity: 0.2;
  transition: transform 0.3s ease;
}

.stat-card:hover i {
  transform: scale(1.1);
}
</style>
