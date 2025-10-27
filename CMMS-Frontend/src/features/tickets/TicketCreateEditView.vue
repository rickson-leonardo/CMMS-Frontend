/**
 * @file TicketCreateEditView.vue
 * @description View com formulário para criar ou editar Tickets.
 * @path src/features/tickets/TicketCreateEditView.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="ticket-create-edit-view">
    <div class="header-section">
      <h1 class="view-title">{{ isEditing ? 'Editar Ticket' : 'Criar Novo Ticket' }}</h1>
      <BaseButton variant="secondary" @click="goBack">Cancelar</BaseButton>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit">
        <!-- Campo Título -->
        <div class="form-group">
          <BaseInput
            v-model="ticketData.title"
            label="Título"
            placeholder="Ex: Equipamento com barulho estranho"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Campo Ativo (Select) -->
        <div class="form-group">
          <BaseSelect
            v-model="ticketData.assetId"
            label="Ativo (Equipamento)"
            placeholder="Selecione o ativo relacionado..."
            :options="assetOptions"
            :loading="isLoadingAssets"
            :disabled="isLoading"
            id="ticket-asset"
          />
           <div class="form-text">Selecione o equipamento ou deixe em branco se não aplicável.</div>
        </div>

        <!-- Campo Descrição (Textarea) -->
        <div class="form-group">
          <BaseTextarea
            v-model="ticketData.description"
            label="Descrição Detalhada"
            placeholder="Forneça detalhes sobre o problema..."
            :rows="6"
            required
            :disabled="isLoading"
          />
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
            {{ isEditing ? 'Salvar Alterações' : 'Enviar Ticket' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>

  </div>
</template>

<script setup>
/**
 * @description Script setup para TicketCreateEditView. Gerencia o estado do formulário
 * para criação ou edição de tickets.
 */
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
// Futuramente: import { ticketService } from './services/ticketService';
// Futuramente: import { assetService } from '@/features/assets/services/assetService';

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(false);
const isLoadingAssets = ref(false); // Para carregar a lista de ativos
const errorMessage = ref(null);
const ticketId = ref(route.params.id || null); // Pega ID se estiver editando
const isEditing = computed(() => !!ticketId.value);

// Dados do formulário
const ticketData = reactive({
  title: '',
  assetId: null, // Armazena o ID do ativo selecionado
  description: '',
});

// Opções para o BaseSelect de Ativos
const assetOptions = ref([]); // Será preenchido pela "API"

// Simulação de busca de Ativos (para o BaseSelect)
async function fetchAssets() {
    isLoadingAssets.value = true;
    console.log("Buscando lista de ativos...");
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay
    try {
        // Dados mockados
        const mockApiResponse = [
             { id: 'uuid-a1', name: 'Compressor de Ar C-101' },
             { id: 'uuid-a2', name: 'Forno Industrial F-01' },
             { id: 'uuid-a3', name: 'Esteira Transportadora E-22' },
             { id: 'uuid-a4', name: 'Empilhadeira Elétrica E-03' },
             { id: 'uuid-a5', name: 'Prensa Hidráulica P-05' }, // Adicionado
             { id: 'uuid-a6', name: 'Bomba Hidráulica B-52' }, // Adicionado
        ];
        // Mapeia para o formato esperado pelo BaseSelect { label, value }
        assetOptions.value = mockApiResponse.map(asset => ({
            label: asset.name,
            value: asset.id,
        }));
         console.log("Ativos carregados:", assetOptions.value);
    } catch (error) {
        console.error("Erro ao buscar ativos:", error);
        errorMessage.value = "Erro ao carregar lista de ativos.";
    } finally {
        isLoadingAssets.value = false;
    }
}

// Simulação de busca de dados do Ticket (se estiver editando)
async function fetchTicketData() {
    if (!isEditing.value) return; // Só busca se for edição
    isLoading.value = true;
    errorMessage.value = null;
    console.log("Buscando dados do Ticket para edição:", ticketId.value);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        // Dados mockados (encontrar o ticket correspondente)
        const mockTicket = { // Exemplo
            'uuid-t1': { title: 'Painel da IHM não responde', assetId: 'uuid-a5', description: 'O painel touch screen...' },
        }[ticketId.value];

        if (mockTicket) {
            ticketData.title = mockTicket.title;
            ticketData.assetId = mockTicket.assetId;
            ticketData.description = mockTicket.description;
        } else {
            throw new Error('Ticket não encontrado para edição.');
        }
    } catch (error) {
        console.error("Erro ao buscar dados do ticket:", error);
        errorMessage.value = `Erro ao carregar ticket: ${error.message}`;
    } finally {
        isLoading.value = false;
    }
}


onMounted(() => {
  fetchAssets(); // Carrega a lista de ativos ao montar
  fetchTicketData(); // Carrega os dados do ticket se estiver editando
});

// Função de submissão (simulada)
async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = null;
  console.log("Submetendo dados do ticket:", ticketData);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay

  try {
      // Lógica futura com ticketService:
      // if (isEditing.value) {
      //   await ticketService.update(ticketId.value, ticketData);
      // } else {
      //   await ticketService.create(ticketData);
      // }
      console.log("Ticket salvo com sucesso (simulado).");
      // Redireciona para a lista de tickets após salvar
      router.push('/tickets');
  } catch (error) {
      console.error("Erro ao salvar ticket:", error);
      errorMessage.value = `Erro ao salvar: ${error.message || 'Tente novamente.'}`;
      isLoading.value = false; // Permite tentar novamente em caso de erro
  }
  // Não reseta isLoading aqui se o redirecionamento ocorrer
}

// Função para voltar
function goBack() {
  router.go(-1); // Volta para a página anterior
}
</script>

<style scoped>
.ticket-create-edit-view {
  max-width: 800px; /* Limita a largura do formulário */
  margin: 0 auto; /* Centraliza */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.view-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.form-group {
  margin-bottom: var(--spacing-6); /* Mais espaço entre os campos */
}

.form-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    margin-top: var(--spacing-1);
}

.form-actions {
  display: flex;
  justify-content: flex-end; /* Alinha botão à direita */
  margin-top: var(--spacing-8);
}

.error-message {
  background-color: var(--color-red-50);
  color: var(--color-feedback-error);
  border: 1px solid var(--color-feedback-error);
  padding: var(--spacing-3);
  border-radius: var(--border-radius-medium);
  margin-top: var(--spacing-4);
  text-align: center;
  font-size: var(--font-size-sm);
}
</style>
