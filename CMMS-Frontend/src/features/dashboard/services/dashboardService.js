// CMMS-Frontend/src/features/dashboard/services/dashboardService.js
import {
  mapApiKpisToUiKpis,
  mapApiWorkOrdersToUiWorkOrders,
} from './dashboardMapper';

const mockApiKpis = {
  pending_approval: 4,
  high_priority: 2,
  in_progress: 7,
  open_tickets: 12,
};

const mockApiWorkOrders = [{
  id: 'uuid-1',
  title_text: 'Verificar superaquecimento do motor',
  asset_name: 'Prensa P-05',
  current_status: 'Aguardando Aprovação',
  priority_level: 1,
  creation_date: '2025-10-24T14:10:00Z',
}, {
  id: 'uuid-2',
  title_text: 'Falha no sensor de pressão',
  asset_name: 'Compressor C-101',
  current_status: 'Em Progresso',
  priority_level: 1,
  creation_date: '2025-10-24T11:30:00Z',
}, ];

export const dashboardService = {
  async getSummary() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mapApiKpisToUiKpis(mockApiKpis));
      }, 500);
    });
  },

  async getCriticalWorkOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApiWorkOrders.map(mapApiWorkOrdersToUiWorkOrders));
      }, 500);
    });
  },
};
