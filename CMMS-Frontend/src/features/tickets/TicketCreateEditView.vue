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
import { createTicket, updateTicket, getTicketById } from './services/ticketService';
import { fetchAssets as fetchAssetsService } from '@/features/assets/services/assetService';

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(false);
const isLoadingAssets = ref(false); // Para carregar a lista de ativos
const errorMessage = ref('');
const ticketId = ref(route.params.id || null); // Pega ID se estiver editando
const isEditing = computed(() => !!ticketId.value);

// Dados do formulário
const ticketData = reactive({
  title: '',
  assetId: null, // Armazena o ID do ativo selecionado
  description: '',
});

// Opções para o BaseSelect de Ativos
const assetOptions = ref([]); // Será preenchido pela API

// Busca de Ativos (para o BaseSelect)
async function fetchAssets() {
    isLoadingAssets.value = true;
    console.log("Buscando lista de ativos...");
    try {
        const response = await fetchAssetsService();
        // A API pode retornar a lista dentro de 'results' se for paginada
        const assets = response.results || response;

        // Mapeia para o formato esperado pelo BaseSelect { label, value }
        assetOptions.value = assets.map(asset => ({
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

// Busca de dados do Ticket (se estiver editando)
async function fetchTicketData() {
    if (!isEditing.value) return; // Só busca se for edição
    isLoading.value = true;
    errorMessage.value = null;
    console.log("Buscando dados do Ticket para edição:", ticketId.value);
    try {
        const data = await getTicketById(ticketId.value);
        ticketData.title = data.title;
        ticketData.assetId = data.asset ? data.asset.id : null;
        ticketData.description = data.description;
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

// Função de submissão
async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = '';
  console.log("Submetendo dados do ticket:", ticketData);

  try {
      if (isEditing.value) {
        await updateTicket(ticketId.value, ticketData);
      } else {
        await createTicket(ticketData);
      }
      console.log("Ticket salvo com sucesso.");
      // Redireciona para a lista de tickets após salvar
      router.push('/tickets');
  } catch (error) {
      console.error("Erro ao salvar ticket:", error);
      errorMessage.value = `Erro ao salvar: ${error.message || 'Tente novamente.'}`;
  } finally {
      isLoading.value = false;
  }
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
