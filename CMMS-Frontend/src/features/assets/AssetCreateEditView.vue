/**
 * @file AssetCreateEditView.vue
 * @description View com formulário para criar ou editar Ativos.
 * @path src/features/assets/AssetCreateEditView.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="asset-create-edit-view">
    <div class="header-section">
      <h1 class="view-title">{{ isEditing ? 'Editar Ativo' : 'Criar Novo Ativo' }}</h1>
       <BaseButton variant="secondary" @click="goBack">Cancelar</BaseButton>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit">
        <!-- Campo Nome do Ativo -->
        <div class="form-group">
          <BaseInput
            v-model="assetData.name"
            label="Nome do Ativo"
            placeholder="Ex: Bomba Hidráulica B-52"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="row">
            <!-- Campo Tag do Ativo -->
            <div class="col-md-6 form-group">
              <BaseInput
                v-model="assetData.asset_tag"
                label="Tag do Ativo (Código)"
                placeholder="Ex: BOMBA-0052"
                :disabled="isLoading"
              />
               <div class="form-text">Identificador único (opcional).</div>
            </div>

            <!-- Campo Localização (Select) -->
            <div class="col-md-6 form-group">
              <BaseSelect
                v-model="assetData.locationId"
                label="Localização"
                placeholder="Selecione a localização..."
                :options="locationOptions"
                :loading="isLoadingLocations"
                :disabled="isLoading"
                id="asset-location"
              />
            </div>
        </div>

        <!-- Campo Criticidade (Select) -->
        <div class="form-group">
             <BaseSelect
                v-model="assetData.criticality"
                label="Nível de Criticidade"
                :options="criticismOptions"
                :disabled="isLoading"
                id="asset-criticism"
                required
              />
             <div class="form-text">Define a prioridade padrão das manutenções (1=Mínimo, 5=Crítico).</div>
        </div>

        <!-- Outros campos podem ser adicionados aqui: Modelo, Fabricante, Data Instalação, etc. -->

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
            {{ isEditing ? 'Salvar Alterações no Ativo' : 'Criar Ativo' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>

  </div>
</template>

<script setup>
/**
 * @description Script setup para AssetCreateEditView. Gerencia o estado do formulário
 * para criação ou edição de Ativos.
 */
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
// Futuramente: import { assetService } from './services/assetService';
// Futuramente: import { locationService } from '@/features/locations/services/locationService'; // Exemplo

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(false);
const isLoadingLocations = ref(false); // Para carregar localizações
const errorMessage = ref(null);
const assetId = ref(route.params.id || null);
const isEditing = computed(() => !!assetId.value);

// Dados do formulário
const assetData = reactive({
  name: '',
  asset_tag: '',
  locationId: null,
  criticality: 3, // Default para 'Médio'
});

// Opções para Selects
const locationOptions = ref([]); // Será preenchido pela "API"
const criticismOptions = ref([
    { label: '1 - Mínimo', value: 1 },
    { label: '2 - Baixo', value: 2 },
    { label: '3 - Médio', value: 3 },
    { label: '4 - Alto', value: 4 },
    { label: '5 - Crítico', value: 5 },
]);

// Simulação de busca de Localizações
async function fetchLocations() {
    isLoadingLocations.value = true;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
    try {
        const mockApiResponse = [
             { id: 'uuid-loc-1', name: 'Ala Norte - Produção' },
             { id: 'uuid-loc-2', name: 'Prédio A, Sala 101' },
             { id: 'uuid-loc-3', name: 'Armazém Central' },
             { id: 'uuid-loc-4', name: 'Galpão B - Expedição' },
        ];
        locationOptions.value = mockApiResponse.map(loc => ({
            label: loc.name,
            value: loc.id,
        }));
    } catch (error) {
        console.error("Erro ao buscar localizações:", error);
        // Não definir errorMessage aqui
    } finally {
        isLoadingLocations.value = false;
    }
}

// Simulação de busca de dados do Ativo (se estiver editando)
async function fetchAssetData() {
    if (!isEditing.value) return;
    isLoading.value = true;
    // ... lógica similar a fetchTicketData ...
    await new Promise(resolve => setTimeout(resolve, 400));
    // Exemplo:
    // assetData.name = 'Nome do Ativo Existente';
    // assetData.asset_tag = 'TAG-EXISTENTE';
    // assetData.locationId = 'uuid-loc-1';
    // assetData.criticality = 5;
    isLoading.value = false;
}

onMounted(() => {
  fetchLocations();
  fetchAssetData();
});

// Função de submissão (simulada)
async function handleSubmit() {
  isLoading.value = true;
  errorMessage.value = null;
  console.log("Submetendo dados do Ativo:", assetData);
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
      // Lógica futura com assetService
      console.log("Ativo salvo com sucesso (simulado).");
      router.push('/assets'); // Redireciona para a lista
  } catch (error) {
      console.error("Erro ao salvar ativo:", error);
      errorMessage.value = `Erro ao salvar: ${error.message || 'Tente novamente.'}`;
      isLoading.value = false;
  }
}

function goBack() {
  router.go(-1);
}
</script>

<style scoped>
/* Estilos similares às outras views de create/edit */
.asset-create-edit-view { max-width: 800px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-6); }
.view-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin: 0; }
.form-group { margin-bottom: var(--spacing-6); }
.form-actions { display: flex; justify-content: flex-end; margin-top: var(--spacing-8); }
.error-message { background-color: var(--color-red-50); color: var(--color-feedback-error); border: 1px solid var(--color-feedback-error); padding: var(--spacing-3); border-radius: var(--border-radius-medium); margin-top: var(--spacing-4); text-align: center; font-size: var(--font-size-sm); }
.form-text { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-1); }
</style>
