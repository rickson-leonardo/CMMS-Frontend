/**
 * @file MainLayout.vue
 * @description Componente que define o layout principal da aplicação
 * (cabeçalho, barra lateral e área de conteúdo) para páginas autenticadas.
 * @path src/components/common/MainLayout.vue
 * @version 1.2.0 - Adiciona links para todos os módulos principais e Portal do Técnico
 * @date 2025-10-24
 */
<template>
  <div class="app-layout">
    <!-- Cabeçalho (Futuramente AppHeader.vue) -->
    <header class="app-header">
      <h1>CMMS Pro</h1>
      <span>Olá, Usuário</span>
    </header>

    <div class="app-body">
      <!-- Barra Lateral (Futuramente AppSidebar.vue) -->
      <aside class="app-sidebar">
        <nav>
          <ul>
            <!-- Módulos Principais -->
            <li><router-link to="/dashboard" active-class="active-link">Dashboard</router-link></li>
            <li><router-link to="/work-orders" active-class="active-link">Ordens de Serviço</router-link></li>
            <li><router-link to="/tickets" active-class="active-link">Tickets</router-link></li>
            <li><router-link to="/assets" active-class="active-link">Ativos</router-link></li>
            
            <!-- Novos Módulos -->
            <li><router-link to="/inventory" active-class="active-link">Inventário</router-link></li>
            <li><router-link to="/preventive-maintenance" active-class="active-link">Manutenção Preventiva</router-link></li>
            <li><router-link to="/locations" active-class="active-link">Localizações/Mapa</router-link></li>

            <!-- Funções Gerenciais/Específicas -->
            <li class="separator"></li>
            <li><router-link to="/technician-portal" active-class="active-link">Portal do Técnico</router-link></li>
            <li><router-link to="/reports" active-class="active-link">Relatórios</router-link></li>
            <li><router-link to="/users" active-class="active-link">Gestão de Usuários</router-link></li>
          </ul>
        </nav>
      </aside>

      <!-- Área de conteúdo onde a página específica será renderizada -->
      <main class="app-main-content">
        <router-view></router-view> <!-- Usa router-view para renderizar o componente filho da rota -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router';
// Não precisamos mais de 'useRouter' aqui, pois estamos usando <router-link>
</script>

<style scoped>
/* Estilos específicos do layout principal */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-6, 1.5rem);
  background-color: var(--color-gray-900, #111827);
  color: var(--color-white, #ffffff);
  height: 60px;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.app-header h1 {
  font-size: var(--font-size-xl, 1.25rem);
  font-weight: var(--font-weight-semibold, 600);
  margin: 0;
}

.app-body {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.app-sidebar {
  width: 220px;
  background-color: var(--color-background-surface, #ffffff);
  padding: var(--spacing-4, 1rem);
  border-right: 1px solid var(--color-border-default, #dee2e6);
  flex-shrink: 0;
  overflow-y: auto; /* Permite rolagem na sidebar */
}

.app-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Estilo do separador */
.app-sidebar li.separator {
  height: 1px;
  background-color: var(--color-border-subtle);
  margin: var(--spacing-4) 0;
}

/* Estilo para <router-link> dentro de <li> */
.app-sidebar li a {
  display: block; /* Faz o link preencher o <li> */
  padding: var(--spacing-3, 0.75rem);
  border-radius: var(--border-radius-medium, 6px);
  color: var(--color-text-default, #1f2937);
  text-decoration: none; /* Remove sublinhado padrão */
  transition: background-color var(--transition-duration-fast), color var(--transition-duration-fast);
  font-weight: var(--font-weight-medium);
}

.app-sidebar li a:hover {
  background-color: var(--color-gray-100);
  color: var(--color-text-default);
}

.app-sidebar li a.active-link {
  background-color: var(--color-blue-50); /* Fundo sutil para link ativo */
  color: var(--color-brand-primary); /* Cor primária para o texto ativo */
  font-weight: var(--font-weight-semibold);
}

.app-main-content {
  flex-grow: 1;
  overflow-y: auto; /* Permite rolagem no conteúdo principal */
  padding: 0; /* O conteúdo das Views filhas deve gerenciar seu próprio padding, como o p-6 no TechnicianPortalView */
  background-color: var(--color-background-page, #f8f9fa);
}
</style>
