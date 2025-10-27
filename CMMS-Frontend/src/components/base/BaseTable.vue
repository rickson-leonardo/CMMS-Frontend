/**
 * @file BaseTable.vue
 * @description Componente reutilizável para exibir dados em formato de tabela,
 * com suporte a colunas configuráveis, slots customizáveis para células e cabeçalhos,
 * loading state e paginação opcional.
 * @path src/components/base/BaseTable.vue
 * @version 1.0.0
 * @date 2025-10-24
 */
<template>
  <div class="base-table-wrapper">
    <div v-if="loading" class="base-table-loading-overlay">
      <!-- Idealmente, usar um componente BaseSpinner aqui -->
      <div class="spinner"></div>
      <span>Carregando dados...</span>
    </div>

    <table class="base-table" :class="{ 'base-table--empty': !items || items.length === 0 }">
      <thead class="base-table__header">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="{ 'base-table__header-cell--sortable': column.sortable }"
            @click="column.sortable ? handleSort(column.key) : null"
            scope="col"
            :aria-sort="getAriaSort(column.key)"
          >
            <!-- Slot customizado para cabeçalho OU título padrão -->
            <slot :name="`headerCell-${column.key}`" :column="column">
              {{ column.title }}
              <span v-if="column.sortable" class="sort-icon">
                <svg v-if="sortState.key === column.key && sortState.order === 'ascend'" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7.247 4.86c.13-.26.38-.41.653-.41h.198c.273 0 .523.15.653.41l3.352 6.704c.14.28.028.625-.262.747l-.297.124c-.29.121-.624.01-.747-.262L8 6.536l-2.741 5.481c-.124.273-.457.383-.747.262l-.297-.124c-.29-.122-.402-.467-.262-.747z"/></svg>
                <svg v-else-if="sortState.key === column.key && sortState.order === 'descend'" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7.247 11.14c.13.26.38.41.653.41h.198c.273 0 .523-.15.653-.41l3.352-6.704c.14-.28.028-.625-.262-.747l-.297-.124c-.29-.121-.624-.01-.747.262L8 9.464l-2.741-5.481c-.124-.273-.457-.383-.747-.262l-.297.124c-.29.122-.402.467-.262.747z"/></svg>
                <svg v-else width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fill-opacity="0.5" d="M4.146 11.146a.5.5 0 0 1 .708 0L8 14.293l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 0 1 0-.708m7.708-6.292a.5.5 0 0 1-.708 0L8 1.707L4.854 4.854a.5.5 0 0 1-.708-.708l3.5-3.5a.5.5 0 0 1 .708 0l3.5 3.5a.5.5 0 0 1 0 .708"/></svg>
              </span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="base-table__body">
        <tr v-if="!loading && (!items || items.length === 0)">
          <td :colspan="columns.length" class="base-table__empty-cell">
            <slot name="empty">
              Nenhum dado encontrado.
            </slot>
          </td>
        </tr>
        <tr v-else v-for="(item, index) in items" :key="item[rowKey] || index">
          <td v-for="column in columns" :key="column.key">
            <!-- Slot customizado para célula OU valor padrão -->
            <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]" :index="index">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="$slots.footer" class="base-table__footer">
        <tr>
          <td :colspan="columns.length">
            <slot name="footer"></slot>
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Paginação (Simplificada - Idealmente usar um componente BasePagination) -->
    <div v-if="pagination" class="base-table__pagination">
       <!-- Conteúdo da paginação viria aqui -->
       <span>Paginação (placeholder)</span>
    </div>

  </div>
</template>

<script setup>
/**
 * @description Script setup para BaseTable. Gerencia colunas, dados, loading,
 * slots com escopo, ordenação e paginação (placeholder).
 *
 * @props {Array} items - Array de objetos de dados a serem exibidos. Padrão: [].
 * @props {Array} columns - Array de objetos de configuração para as colunas.
 * Cada objeto DEVE ter 'key' (String, chave no objeto de item) e 'title' (String, título do cabeçalho).
 * Pode incluir 'sortable' (Boolean). Padrão: [].
 * @props {String} rowKey - Chave única em cada objeto de item para usar como :key no v-for. Padrão: 'id'.
 * @props {Boolean} loading - Se true, exibe um overlay de carregamento. Padrão: false.
 * @props {Object | Boolean} pagination - Objeto de configuração para paginação ou false para desabilitar. Padrão: false.
 *
 * @slots headerCell-{key} (escopo: { column }) - Customiza o cabeçalho de uma coluna específica.
 * @slots cell-{key} (escopo: { item, value, index }) - Customiza a célula de uma coluna específica. Essencial para flexibilidade.
 * @slots empty - Conteúdo exibido quando a tabela está vazia.
 * @slots footer - Conteúdo exibido no rodapé da tabela (tfoot).
 *
 * @emits sort ({ key: String, order: 'ascend' | 'descend' | null }) - Emitido ao clicar em um cabeçalho classificável.
 */
import { ref, reactive } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
    required: true,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: [Object, Boolean],
    default: false,
  },
});

const emit = defineEmits(['sort']);

// Estado interno para controlar a ordenação
const sortState = reactive({
  key: null,
  order: null, // 'ascend', 'descend', null
});

/**
 * @function handleSort
 * @description Lida com o clique no cabeçalho de uma coluna classificável,
 * atualiza o estado interno de ordenação e emite o evento 'sort'.
 * @param {String} key - A chave da coluna clicada.
 */
function handleSort(key) {
  if (sortState.key === key) {
    // Ciclo: null -> ascend -> descend -> null
    if (sortState.order === 'ascend') {
      sortState.order = 'descend';
    } else if (sortState.order === 'descend') {
      sortState.key = null;
      sortState.order = null;
    }
  } else {
    sortState.key = key;
    sortState.order = 'ascend';
  }
  emit('sort', { key: sortState.key, order: sortState.order });
}

/**
 * @function getAriaSort
 * @description Retorna o valor correto para o atributo aria-sort com base no estado.
 * @param {String} key - A chave da coluna.
 * @returns {'ascending' | 'descending' | 'none'}
 */
function getAriaSort(key) {
    if (sortState.key !== key) {
        return 'none';
    }
    if (sortState.order === 'ascend') {
        return 'ascending';
    }
    if (sortState.order === 'descend') {
        return 'descending';
    }
    return 'none';
}

</script>

<style scoped>
.base-table-wrapper {
  position: relative;
  overflow-x: auto; /* Permite scroll horizontal em tabelas largas */
}

.base-table {
  width: 100%;
  border-collapse: collapse; /* Remove espaços entre células */
  background-color: var(--color-background-surface);
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
}

/* Cabeçalho */
.base-table__header th {
  background-color: var(--color-background-muted);
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  border-bottom: 2px solid var(--color-border-default);
  white-space: nowrap; /* Evita quebra de linha no cabeçalho */
}

.base-table__header-cell--sortable {
  cursor: pointer;
  user-select: none; /* Impede seleção de texto ao clicar */
}
.base-table__header-cell--sortable:hover {
  background-color: var(--color-gray-200); /* Feedback visual no hover */
}
.sort-icon {
  margin-left: var(--spacing-1);
  vertical-align: middle;
  display: inline-block;
  opacity: 0.7;
}
.base-table__header-cell--sortable:hover .sort-icon {
    opacity: 1;
}

/* Corpo */
.base-table__body td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--color-border-default);
  vertical-align: middle; /* Alinha conteúdo verticalmente */
}

/* Linha Hover (opcional, pode vir de uma classe global) */
.base-table__body tr:hover {
  background-color: var(--color-background-muted);
}

/* Célula Vazia */
.base-table__empty-cell {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
  color: var(--color-text-muted);
  font-style: italic;
}

/* Rodapé */
.base-table__footer td {
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 2px solid var(--color-border-default);
  background-color: var(--color-background-muted);
}

/* Overlay de Loading */
.base-table-loading-overlay {
  position: absolute;
  inset: 0; /* Cobre toda a área do wrapper */
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: var(--color-text-default);
  font-weight: var(--font-weight-medium);
}
.spinner { /* Spinner CSS simples */
  border: 4px solid var(--color-background-muted);
  border-top: 4px solid var(--color-interactive-primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-3);
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Paginação (placeholder) */
.base-table__pagination {
  padding: var(--spacing-4);
  text-align: right;
  border-top: 1px solid var(--color-border-default);
}
</style>
