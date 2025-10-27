/**
 * @file CalendarView.vue
 * @description View para exibir o calendário de manutenções (OS e PM) usando FullCalendar.
 * @path src/features/calendar/CalendarView.vue
 * @version 1.3.0 - Remove importações CSS (tentativa via index.html)
 * @date 2025-10-24
 */
<template>
  <div class="calendar-view">
    <div class="header-section">
      <h1 class="view-title">Calendário de Manutenções</h1>
      <!-- Botão para Nova OS pode vir aqui -->
    </div>

    <BaseCard>
      <template #title>Visualização do Calendário</template>
      <!-- O componente FullCalendar será renderizado aqui -->
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    </BaseCard>

    <!-- Modal para Detalhes do Evento (simplificado) -->
    <div v-if="selectedEvent" class="event-modal">
        <h3>{{ selectedEvent.title }}</h3>
        <p><strong>Status:</strong> {{ selectedEvent.extendedProps?.status || 'N/A' }}</p>
        <p><strong>Ativo:</strong> {{ selectedEvent.extendedProps?.asset || 'N/A' }}</p>
        <p><strong>Atribuído a:</strong> {{ selectedEvent.extendedProps?.assignedTo || 'N/A' }}</p>
        <BaseButton variant="secondary" @click="selectedEvent = null">Fechar</BaseButton>
        <!-- Adicionar botão para ver detalhes da OS/PM -->
    </div>

  </div>
</template>

<script setup>
/**
 * @description Script setup para CalendarView. Inicializa e configura o FullCalendar.
 */
import { ref, onMounted } from 'vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';

// Importações do FullCalendar - Componente Vue e Plugins JS
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

// ***** NENHUMA IMPORTAÇÃO CSS AQUI *****

// Estado (mantido)
const isLoading = ref(true);
const fullCalendar = ref(null);
const selectedEvent = ref(null);

// Dados Simulados (mantidos)
const mockEvents = [
  // ... (eventos simulados como antes) ...
  {
    title: 'OS: Falha no sensor',
    start: '2025-10-16T15:30:00',
    className: 'fc-event-info',
    extendedProps: { status: 'Em Progresso', asset: 'Compressor de Ar C-101', assignedTo: 'João Silva' }
  },
  {
    title: 'OS: Vazamento na Prensa',
    start: '2025-10-16',
    allDay: true,
    className: 'fc-event-warning',
    extendedProps: { status: 'Aguardando Aprovação', asset: 'Prensa Hidráulica P-05', assignedTo: 'Não atribuído' }
  },
  {
    title: 'PM: Lubrificação da Esteira',
    start: '2025-10-20',
    allDay: true,
    className: 'fc-event-primary',
    extendedProps: { status: 'Manutenção Preventiva', asset: 'Esteira E-22', assignedTo: 'Equipe de Manutenção' }
  },
   {
    title: 'OS: Troca de rolamento',
    start: '2025-10-22T09:00:00',
    end: '2025-10-22T12:00:00',
    className: 'fc-event-success',
    extendedProps: { status: 'Aberta', asset: 'Motor Elétrico M-08', assignedTo: 'Ana Souza' }
  },
  {
    title: 'PM: Inspeção de segurança',
    start: '2025-10-10',
    allDay: true,
    className: 'fc-event-danger',
    extendedProps: { status: 'Atrasada', asset: 'Painel Elétrico Principal', assignedTo: 'Equipe de Elétrica' }
  }
];

// Opções do Calendário (mantidas)
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: ptBrLocale,
  headerToolbar: { /* ... */ },
  events: mockEvents,
  editable: false,
  selectable: false,
  eventClick: handleEventClick,
});

// Função handleEventClick (mantida)
function handleEventClick(clickInfo) { /* ... */ }

onMounted(() => {
  isLoading.value = false;
});

</script>

<style>
/* Estilos (mantidos) */
/* ... */
</style>

