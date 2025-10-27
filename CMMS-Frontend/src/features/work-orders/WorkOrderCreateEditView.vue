/**
 * @file WorkOrderCreateEditView.vue
 * @description View com formulário para criar ou editar Ordens de Serviço.
 * @path src/features/work-orders/WorkOrderCreateEditView.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="wo-create-edit-view">
    <div class="header-section">
      <h1 class="view-title">{{ isEditing ? 'Editar Ordem de Serviço' : 'Criar Nova Ordem de Serviço' }}</h1>
       <BaseButton variant="secondary" @click="goBack">Cancelar</BaseButton>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit">
        <!-- Campo Título -->
        <div class="form-group">
          <BaseInput
            v-model="workOrderData.title"
            label="Título da OS"
            placeholder="Ex: Verificar vazamento no compressor C-101"
            required
            :disabled="isLoading"
          />
        </div>

         <!-- Campo Ativo (Select) -->
        <div class="form-group">
          <BaseSelect
            v-model="workOrderData.assetId"
            label="Ativo Relacionado"
            placeholder="Selecione o ativo..."
            :options="assetOptions"
            :loading="isLoadingAssets"
            :disabled="isLoading"
            id="wo-asset"
            required
          />
        </div>

        <!-- Campo Descrição (Textarea) -->
        <div class="form-group">
          <BaseTextarea
            v-model="workOrderData.description"
            label="Descrição Detalhada do Serviço"
            placeholder="Descreva o problema ou o trabalho a ser realizado..."
            :rows="5"
            :disabled="isLoading"
          />
        </div>

        <hr class="my-4">

        <div class="row">
            <!-- Campo Prioridade (Select) -->
            <div class="col-md-6 form-group">
              <BaseSelect
                v-model="workOrderData.priority"
                label="Prioridade"
                :options="priorityOptions"
                :disabled="isLoading"
                id="wo-priority"
                required
              />
            </div>

            <!-- Campo Atribuído a (Select - Futuro) -->
            <div class="col-md-6 form-group">
                 <BaseSelect
                    v-model="workOrderData.assignedToId"
                    label="Atribuir Técnico (Opcional)"
                    placeholder="Selecione um técnico..."
                    :options="technicianOptions"
                    :loading="isLoadingTechnicians"
                    :disabled="isLoading"
                    id="wo-assigned"
                 />
                 <!-- <BaseInput label="Atribuído a (Técnico)" placeholder="ID ou nome do técnico" disabled/> -->
                 <!-- Idealmente seria um BaseSelect populado com usuários técnicos -->
            </div>
        </div>

        <!-- Campo Data Agendada (Futuro - BaseDatePicker) -->
        <div class="form-group">
           <BaseInput
             type="datetime-local"
             v-model="workOrderData.scheduledStart"
             label="Início Agendado (Opcional)"
             :disabled="isLoading"
           />
           <!-- Idealmente seria um componente BaseDatePicker -->
        </div>


        <!-- Mensagem de Erro -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Botões de Ação -->
        <div class="form-actions">
           <BaseButton
            type="submit"
            variant="primary"
            :loading="isLoading"
            :disabled="isLoading"
            htmlType="submit"
          >
            {{ isEditing ? 'Salvar Alterações na OS' : 'Criar Ordem de Serviço' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>

  </div>
</template>

<script setup>
/**
 * @description Script setup para WorkOrderCreateEditView. Gerencia o estado do formulário
 * para criação ou edição de Ordens de Serviço.
 */
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
// Futuramente: import { workOrderService } from './services/workOrderService';
// Futuramente: import { assetService } from '@/features/assets/services/assetService';
// Futuramente: import { userService } from '@/services/userService'; // Para buscar técnicos

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(false);
const isLoadingAssets = ref(false);
const isLoadingTechnicians = ref(false); // Para carregar técnicos
const errorMessage = ref(null);
const workOrderId = ref(route.params.id || null);
const isEditing = computed(() => !!workOrderId.value);

// Dados do formulário
const workOrderData = reactive({
  title: '',
  assetId: null,
  description: '',
  priority: 3, // Default para 'Normal'
  assignedToId: null,
  scheduledStart: null,
});

// Opções para Selects
const assetOptions = ref([]);
const technicianOptions = ref([]); // Será preenchido pela "API"
const priorityOptions = ref([
    { label: '1 - Alta', value: 1 },
    { label: '2 - Média', value: 2 },
    { label: '3 - Normal', value: 3 },
    // Adicionar mais se necessário
]);

// Simulação de busca de Ativos
async function fetchAssets() {
    isLoadingAssets.value = true;
    await new Promise(resolve => setTimeout(resolve, 600)); // Simula delay
    try {
        const mockApiResponse = [
             { id: 'uuid-a1', name: 'Compressor de Ar C-101' },
             { id: 'uuid-a2', name: 'Forno Industrial F-01' },
             { id: 'uuid-a3', name: 'Esteira Transportadora E-22' },
             { id: 'uuid-a4', name: 'Empilhadeira Elétrica E-03' },
             { id: 'uuid-a5', name: 'Prensa Hidráulica P-05' },
             { id: 'uuid-a6', name: 'Bomba Hidráulica B-52' },
        ];
        assetOptions.value = mockApiResponse.map(asset => ({
            label: `${asset.name} (${asset.id.substring(0, 8)})`, // Inclui parte do ID para clareza
            value: asset.id,
        }));
    } catch (error) {
        console.error("Erro ao buscar ativos:", error);
        errorMessage.value = "Erro ao carregar lista de ativos.";
    } finally {
        isLoadingAssets.value = false;
    }
}

// Simulação de busca de Técnicos
async function fetchTechnicians() {
    isLoadingTechnicians.value = true;
    await new Promise(resolve => setTimeout(resolve, 700)); // Simula delay
    try {
        const mockApiResponse = [
            { id: 'uuid-user-1', name: 'João Silva' },
            { id: 'uuid-user-2', name: 'Ana Souza' },
            { id: 'uuid-user-3', name: 'Carlos Pereira' },
        ];
        technicianOptions.value = mockApiResponse.map(tech => ({
            label: tech.name,
            value: tech.id,
        }));
    } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
        // Não definir errorMessage aqui para não sobrepor outros erros
    } finally {
        isLoadingTechnicians.value = false;
    }
}


// Simulação de busca de dados da OS (se estiver editando)
async function fetchWorkOrderData() {
    if (!isEditing.value) return;
    isLoading.value = true;
    // ... lógica similar a fetchTicketData ...
    // Preencher workOrderData com dados mockados ou da API
    await new Promise(resolve => setTimeout(resolve, 500));
    // Exemplo:
    // workOrderData.title = 'Título da OS existente';
    // workOrderData.assetId = 'uuid-a1';
    // workOrderData.priority = 1;
    isLoading.value = false;
}

onMounted(() => {
  fetchAssets();
  fetchTechnicians();
  fetchWorkOrderData();
});

// Função de submissão (simulada)
async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = null;
  console.log("Submetendo dados da OS:", workOrderData);
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
      // Lógica futura com workOrderService
      console.log("Ordem de Serviço salva com sucesso (simulado).");
      router.push('/work-orders'); // Redireciona para a lista
  } catch (error) {
      console.error("Erro ao salvar OS:", error);
      errorMessage.value = `Erro ao salvar: ${error.message || 'Tente novamente.'}`;
      isLoading.value = false;
  }
}

function goBack() {
  router.go(-1);
}
</script>

<style scoped>
/* Estilos similares a TicketCreateEditView */
.wo-create-edit-view { max-width: 800px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); }
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.form-group { margin-bottom: var(--spacing-6); }
.form-actions { display: flex; justify-content: flex-end; margin-top: var(--spacing-8); }
.error-message { background-color: var(--color-red-50); color: var(--color-feedback-error); border: 1px solid var(--color-feedback-error); padding: var(--spacing-3); border-radius: var(--border-radius-medium); margin-top: var(--spacing-4); text-align: center; font-size: var(--font-size-sm); }
</style>
