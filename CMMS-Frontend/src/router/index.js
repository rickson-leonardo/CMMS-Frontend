/**
 * @file index.js
 * @description Configuração do Vue Router para a aplicação.
 * @path src/router/index.js
 * @version 2.1.0 - Adição da rota 404 (NotFound).
 * @date 2025-10-24
 */
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/common/MainLayout.vue';

// Views base
import LoginView from '@/features/auth/LoginView.vue';
import DashboardView from '@/features/dashboard/DashboardView.vue';
import WorkOrdersView from '@/features/work-orders/WorkOrdersView.vue';
import AssetsView from '@/features/assets/AssetsView.vue';
import TicketsView from '@/features/tickets/TicketsView.vue';

// Novas Views de Módulos (Listagem)
import InventoryView from '@/features/inventory/InventoryView.vue';
import PreventiveMaintenanceView from '@/features/preventive-maintenance/PreventiveMaintenanceView.vue';
import ReportsView from '@/features/reports/ReportsView.vue';
import UsersView from '@/features/users/UsersView.vue';

// Views Detalhadas e Específicas
import AssetDetailView from '@/features/assets/AssetDetailView.vue';
import PartDetailView from '@/features/inventory/PartDetailView.vue';
import LocationManagementView from '@/features/locations/LocationManagementView.vue';
import TechnicianPortalView from '@/features/technician/TechnicianPortalView.vue';

// --- NOVA IMPORTAÇÃO ---
// Importa o componente 404 do local correto (common), não de 'views'
import NotFoundView from '@/components/common/NotFoundView.vue';
// --- FIM DA NOVA IMPORTAÇÃO ---

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/',
    component: MainLayout,
    // meta: { requiresAuth: true }, // Descomente quando a lógica de auth estiver pronta
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'work-orders',
        name: 'work-orders',
        component: WorkOrdersView,
        meta: { title: 'Ordens de Serviço' }
      },
      {
        path: 'assets',
        name: 'assets',
        component: AssetsView,
        meta: { title: 'Ativos' }
      },
      {
        path: 'assets/:id',
        name: 'asset-detail',
        component: AssetDetailView,
        meta: { title: 'Detalhes do Ativo' }
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: TicketsView,
        meta: { title: 'Tickets' }
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: InventoryView,
        meta: { title: 'Inventário' }
      },
      {
        path: 'inventory/part/:id',
        name: 'part-detail',
        component: PartDetailView,
        meta: { title: 'Detalhes da Peça' }
      },
      {
        path: 'preventive-maintenance',
        name: 'preventive-maintenance',
        component: PreventiveMaintenanceView,
        meta: { title: 'Manutenção Preventiva' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: ReportsView,
        meta: { title: 'Relatórios' }
      },
      {
        path: 'users',
        name: 'users',
        component: UsersView,
        meta: { title: 'Gestão de Usuários' }
      },
      {
        path: 'locations',
        name: 'locations',
        component: LocationManagementView,
        meta: { title: 'Gestão de Localizações' }
      },
      {
        path: 'technician-portal',
        name: 'technician-portal',
        component: TechnicianPortalView,
        meta: { title: 'Portal do Técnico' }
      },
      // Redirecionamento da raiz para o dashboard
      {
        path: '',
        redirect: '/dashboard'
      }
    ]
  },
  
  // --- NOVA ROTA 404 (Catch-All) ---
  // Esta rota deve ser a ÚLTIMA da lista.
  // Ela captura qualquer URL que não foi correspondida pelas rotas anteriores.
  {
    path: '/:pathMatch(.*)*', // Expressão regex para "pegar tudo"
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 - Não Encontrado' }
  }
  // --- FIM DA NOVA ROTA ---
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// (Opcional) Lógica de Título Dinâmico
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - CMMS Pro` || 'CMMS Pro';
  next();
});

export default router;