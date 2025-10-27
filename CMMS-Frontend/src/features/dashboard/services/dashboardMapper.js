// CMMS-Frontend/src/features/dashboard/services/dashboardMapper.js

export function mapApiKpisToUiKpis(apiKpis) {
  return [{
    id: 'pending',
    title: 'OS Aguardando Aprovação',
    value: apiKpis.pending_approval,
    color: 'warning',
    icon: 'patch-question-fill',
  }, {
    id: 'priority',
    title: 'OS de Alta Prioridade',
    value: apiKpis.high_priority,
    color: 'danger',
    icon: 'exclamation-triangle-fill',
  }, {
    id: 'progress',
    title: 'OS Em Progresso',
    value: apiKpis.in_progress,
    color: 'info',
    icon: 'gear-wide-connected',
  }, {
    id: 'tickets',
    title: 'Tickets Abertos',
    value: apiKpis.open_tickets,
    color: 'primary',
    icon: 'ticket-detailed-fill',
  }, ];
}

export function mapApiWorkOrdersToUiWorkOrders(apiWorkOrder) {
  return {
    id: apiWorkOrder.id,
    title: apiWorkOrder.title_text,
    asset: apiWorkOrder.asset_name,
    status: apiWorkOrder.current_status,
    priority: apiWorkOrder.priority_level,
    assignedTo: apiWorkOrder.assigned_user_name,
    createdDate: new Date(apiWorkOrder.creation_date),
  };
}

export function mapApiTicketsToUiTickets(apiTicket) {
  return {
    id: apiTicket.id,
    title: apiTicket.title,
    requester: apiTicket.requester_name,
    // a real implementation would calculate this difference
    timeSinceCreation: apiTicket.time_since_creation,
  };
}
