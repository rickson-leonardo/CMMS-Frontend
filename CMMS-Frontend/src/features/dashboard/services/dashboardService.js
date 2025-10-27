// CMMS-Frontend/src/features/dashboard/services/dashboardService.js
import {
  mapApiKpisToUiKpis,
  mapApiWorkOrdersToUiWorkOrders,
  mapApiTicketsToUiTickets,
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
  asset_name: 'Prensa Hidráulica P-05',
  current_status: 'Aguardando Aprovação',
  priority_level: 1,
  assigned_user_name: 'Não atribuído',
  creation_date: '2025-10-24T14:10:00Z',
}, {
  id: 'uuid-2',
  title_text: 'Falha no sensor de pressão',
  asset_name: 'Compressor de Ar C-101',
  current_status: 'Em Progresso',
  priority_level: 1,
  assigned_user_name: 'João Silva',
  creation_date: '2025-10-24T11:30:00Z',
}, {
  id: 'uuid-3',
  title_text: 'Ruído incomum na esteira transportadora',
  asset_name: 'Esteira E-22',
  current_status: 'Aberta',
  priority_level: 2,
  assigned_user_name: 'Não atribuído',
  creation_date: '2025-10-23T17:00:00Z',
}, {
  id: 'uuid-4',
  title_text: 'Vazamento de óleo na unidade hidráulica',
  asset_name: 'Bomba Hidráulica B-52',
  current_status: 'Em Espera',
  priority_level: 2,
  assigned_user_name: 'Carlos Pereira',
  creation_date: '2025-10-23T15:45:00Z',
}, {
  id: 'uuid-5',
  title_text: 'Manutenção preventiva semanal',
  asset_name: 'Forno Industrial F-01',
  current_status: 'Aberta',
  priority_level: 3,
  assigned_user_name: 'Ana Carolina Souza',
  creation_date: '2025-10-23T09:00:00Z',
}, ];

const mockApiTickets = [{
  id: 'uuid-t1',
  title: 'Painel da IHM não responde',
  requester_name: 'Roberto Andrade',
  time_since_creation: '3 min atrás',
}, {
  id: 'uuid-t2',
  title: 'Luz de emergência piscando',
  requester_name: 'Lúcia Martins',
  time_since_creation: '25 min atrás',
}, {
  id: 'uuid-t3',
  title: 'Porta do almoxarifado não trava',
  requester_name: 'Fernando Costa',
  time_since_creation: '1 hora atrás',
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

  async getRecentTickets() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApiTickets.map(mapApiTicketsToUiTickets));
      }, 500);
    });
  },
};
