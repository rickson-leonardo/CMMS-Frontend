// CMMS-Frontend/src/features/dashboard/services/dashboardMapper.js

export function mapApiKpisToUiKpis(apiKpis) {
  return [{
    id: 'pending',
    title: 'OS Aguardando Aprovação',
    value: apiKpis.pending_approval,
  }, {
    id: 'priority',
    title: 'OS de Alta Prioridade',
    value: apiKpis.high_priority,
  }, {
    id: 'progress',
    title: 'OS Em Progresso',
    value: apiKpis.in_progress,
  }, {
    id: 'tickets',
    title: 'Tickets Abertos',
    value: apiKpis.open_tickets,
  }, ];
}

export function mapApiWorkOrdersToUiWorkOrders(apiWorkOrder) {
  return {
    id: apiWorkOrder.id,
    title: apiWorkOrder.title_text,
    asset: apiWorkOrder.asset_name,
    status: apiWorkOrder.current_status,
    priority: apiWorkOrder.priority_level,
    createdDate: new Date(apiWorkOrder.creation_date),
  };
}
