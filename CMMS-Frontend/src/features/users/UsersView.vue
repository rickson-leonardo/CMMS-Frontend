/**
 * @file UsersView.vue
 * @description View para listar e gerenciar usuários do sistema.
 * @path src/features/users/UsersView.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="users-view">
    <div class="header-section">
      <h1 class="view-title">Gestão de Usuários</h1>
      <BaseButton variant="primary" @click="goToCreateUser">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill me-1" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/></svg>
        Novo Usuário
      </BaseButton>
    </div>

    <!-- Filtros (Simplificado) -->
    <BaseCard class="mb-4 filter-card">
       <template #title>Filtros</template>
        <form class="filter-form row g-3 align-items-end">
            <div class="col-md-6">
                <BaseInput label="Buscar Usuário" placeholder="Nome, Email..." />
            </div>
             <div class="col-md-4">
                <BaseSelect label="Função" :options="roleOptions" placeholder="Todas"/>
            </div>
            <div class="col-md-2">
                <BaseButton type="submit" variant="secondary" class="w-100">Filtrar</BaseButton>
            </div>
        </form>
    </BaseCard>

    <!-- Tabela -->
    <BaseCard>
       <BaseTable
        :items="mockUsers"
        :columns="tableColumns"
        :loading="isLoading"
        row-key="id"
        class="users-table"
      >
         <template #cell-role="{ value }">
            <span :class="['role-badge', `role-${value.toLowerCase()}`]">
                {{ getRoleLabel(value) }}
            </span>
         </template>
        <template #cell-actions="{ item }">
           <BaseButton variant="secondary" size="small" @click.stop="goToEditUser(item.id)" class="me-2">
             Editar
           </BaseButton>
           <!-- Botão de Desativar/Ativar seria adicionado aqui -->
        </template>
        <template #empty>
          <div class="empty-state">Nenhum usuário encontrado.</div>
        </template>
       </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup>
/**
 * @description Script setup para UsersView. Lista usuários e permite filtros.
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue'; // Placeholder filter
import BaseSelect from '@/components/base/BaseSelect.vue'; // Placeholder filter

const router = useRouter();
const isLoading = ref(false);

// Dados simulados (baseados em all-models.py -> User.ROLE_CHOICES)
const mockUsers = ref([
  { id: 'uuid-user-m', full_name: 'Maria Almeida', email: 'maria.almeida@email.com', role: 'manager' },
  { id: 'uuid-user-1', full_name: 'João Silva', email: 'joao.silva@email.com', role: 'technician' },
  { id: 'uuid-user-2', full_name: 'Ana Souza', email: 'ana.souza@email.com', role: 'technician' },
  { id: 'uuid-user-r', full_name: 'Roberto Andrade', email: 'roberto.andrade@email.com', role: 'requester' },
  { id: 'uuid-user-a', full_name: 'Admin Sistema', email: 'admin@cmms.com', role: 'admin' },
]);

// Opções para filtro de Função
const roleOptions = ref([
    { label: 'Administrador', value: 'admin' },
    { label: 'Gerente', value: 'manager' },
    { label: 'Técnico', value: 'technician' },
    { label: 'Solicitante', value: 'requester' },
]);

// Colunas da tabela
const tableColumns = ref([
  { key: 'full_name', title: 'Nome Completo', sortable: true },
  { key: 'email', title: 'E-mail', sortable: true },
  { key: 'role', title: 'Função', sortable: true },
  { key: 'actions', title: 'Ações', class: 'text-end' }
]);

// Função Auxiliar para Label da Função
function getRoleLabel(roleValue) {
    const option = roleOptions.value.find(opt => opt.value === roleValue);
    return option ? option.label : roleValue;
}

// Navegação (Placeholders)
function goToCreateUser() { console.log('Ir para criar usuário'); /* router.push('/users/new'); */ }
function goToEditUser(id) { console.log('Ir para editar usuário:', id); /* router.push(`/users/${id}/edit`); */ }

</script>

<style scoped>
/* Estilos gerais herdados */
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); flex-wrap: wrap; gap: var(--spacing-4);}
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.filter-card { margin-bottom: var(--spacing-6); }
.empty-state { text-align: center; padding: var(--spacing-8); color: var(--color-text-muted); }
.text-end { text-align: right; }

/* Estilos para Badges de Função */
.role-badge {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-medium);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
  white-space: nowrap;
  color: var(--color-white); /* Cor de texto padrão */
}
.role-admin { background-color: var(--color-red-500); }
.role-manager { background-color: var(--color-blue-500); }
.role-technician { background-color: var(--color-green-500); }
.role-requester { background-color: var(--color-gray-500); }
</style>
