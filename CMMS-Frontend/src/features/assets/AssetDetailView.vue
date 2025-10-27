/**
 * @file AssetDetailView.vue
 * @description View para exibir os detalhes de um Ativo específico.
 * @path src/features/assets/AssetDetailView.vue
 * @version 1.1.0 - Adiciona botão Editar
 * @date 2025-10-24
 */
<template>
 <div class="asset-detail-view">
    <div class="header-section">
      <h1 class="view-title">Detalhes do Ativo: <span v-if="asset">#{{ assetIdShort }} - {{ asset.name }}</span></h1>
       <div> <!-- Wrapper para botões -->
         <!-- Botão Editar -->
        <BaseButton variant="primary" @click="goToEditAsset" class="me-2">
            Editar Ativo
        </BaseButton>
        <BaseButton variant="secondary" @click="goBack">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/></svg>
           Voltar para Lista
        </BaseButton>
       </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      Carregando detalhes do Ativo...
    </div>
    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>
    <div v-else-if="asset" class="details-grid">
      <!-- Coluna Esquerda: Informações Gerais -->
       <BaseCard class="info-card">
           <template #title>Informações Gerais</template>
            <ul class="details-list">
                <li><strong>Tag:</strong> <code>{{ asset.asset_tag || '-' }}</code></li>
                <li><strong>Localização:</strong> {{ asset.location || '-' }}</li>
                <li>
                  <strong>Criticidade:</strong>
                  <span :class="['criticism-dot', getCriticismColorClass(asset.criticality)]"></span>
                  {{ asset.criticality }} - {{ getCriticismLabel(asset.criticality) }}
                </li>
                 <!-- Adicionar mais campos: Fabricante, Modelo, Data Instalação, etc. -->
            </ul>
       </BaseCard>

       <!-- Coluna Direita: Histórico, PMs, etc. (com Abas) -->
       <BaseCard class="details-card">
            <!-- Abas futuras aqui -->
            <h5>Histórico de Manutenção (Recente)</h5>
            <p class="text-muted">Nenhuma OS recente encontrada para este ativo.</p>
       </BaseCard>
    </div>
 </div>
</template>

<script setup>
/**
 * @description Script setup para AssetDetailView. Busca dados do Ativo
 * com base no ID da rota e exibe os detalhes. Adiciona navegação para Editar.
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const route = useRoute();
const router = useRouter();

// Estado
const isLoading = ref(true);
const asset = ref(null);
const error = ref(null);
const assetId = ref(route.params.id);
const assetIdShort = computed(() => assetId.value?.substring(0, 8) || '');

// Dados simulados
const mockAssets = {
    'uuid-a1': { id: 'uuid-a1', name: 'Compressor de Ar C-101', asset_tag: 'COMP-00101', location: 'Ala Norte - Produção', criticality: 5 },
    'uuid-a2': { id: 'uuid-a2', name: 'Forno Industrial F-01', asset_tag: 'FORN-0001', location: 'Prédio A, Sala 101', criticality: 5 },
    'uuid-a3': { id: 'uuid-a3', name: 'Esteira Transportadora E-22', asset_tag: 'EST-0022', location: 'Ala Norte - Produção', criticality: 3 },
    'uuid-a4': { id: 'uuid-a4', name: 'Empilhadeira Elétrica E-03', asset_tag: 'EMP-0003', location: 'Armazém Central', criticality: 2 },
};

onMounted(() => {
  fetchAssetDetail();
});

// Função para buscar dados do Ativo (simulada)
async function fetchAssetDetail() {
  isLoading.value = true;
  error.value = null;
  await new Promise(resolve => setTimeout(resolve, 600));
  try {
      const data = mockAssets[assetId.value];
      if (data) {
          asset.value = data;
      } else {
          throw new Error('Ativo não encontrado.');
      }
  } catch (err) {
      error.value = `Não foi possível carregar os detalhes do Ativo ${assetIdShort.value}. ${err.message}`;
  } finally {
      isLoading.value = false;
  }
}

// Função para voltar à lista
function goBack() {
  router.push('/assets');
}

// --- Nova Função de Navegação ---
function goToEditAsset() {
    router.push(`/assets/${assetId.value}/edit`);
}

// Funções auxiliares de Criticidade (copiadas de AssetsView)
function getCriticismLabel(value) { /* ... */ }
function getCriticismColorClass(value) { /* ... */ }

</script>

<style scoped>
/* Estilos similares a WorkOrderDetailView */
.asset-detail-view { }
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}
.view-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}
.view-title span { color: var(--color-text-default); }

.loading-state, .error-state { text-align: center; padding: var(--spacing-8); font-style: italic; color: var(--color-text-muted); }
.error-state { color: var(--color-feedback-error); font-weight: var(--font-weight-medium); }

.details-grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-6); }
@media (min-width: 992px) { .details-grid { grid-template-columns: 320px 1fr; } }

.info-card { position: sticky; top: calc(var(--spacing-6) + 60px); }

.details-list { list-style: none; padding: 0; margin: 0; }
.details-list li { padding: var(--spacing-2) 0; border-bottom: 1px solid var(--color-border-default); font-size: var(--font-size-sm); }
.details-list li:last-child { border-bottom: none; }
.details-list strong { display: inline-block; width: 90px; color: var(--color-text-muted); font-weight: var(--font-weight-medium); }
.details-list code { font-size: inherit; } /* Garante que 'code' não mude o tamanho */

.criticidade-dot { height: 12px; width: 12px; border-radius: 50%; display: inline-block; margin-right: var(--spacing-1); vertical-align: middle; }
.bg-danger { background-color: var(--color-priority-1); }
.bg-warning { background-color: var(--color-priority-2); }
.bg-yellow-400 { background-color: var(--color-priority-3); }
.bg-success { background-color: var(--color-feedback-success); }
.bg-secondary { background-color: var(--color-gray-500); }

.details-card h5 { margin-bottom: var(--spacing-4); font-weight: var(--font-weight-semibold); }
</style>

