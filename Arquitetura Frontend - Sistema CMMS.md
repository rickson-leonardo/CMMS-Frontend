# Documento de Arquitetura Frontend - Sistema CMMS

Versão: 1.0

Data: 24 de outubro de 2023

Autor: Arquiteto de Soluções Frontend Sênior

## 1.0 Introdução e Visão Arquitetural

### 1.1 Propósito do Documento

Este documento estabelece o plano arquitetural oficial, os padrões técnicos e as melhores práticas para o desenvolvimento da aplicação frontend do Sistema de Gerenciamento de Manutenção Computadorizado (CMMS). Ele serve como a única **fonte da verdade** para todas as decisões de desenvolvimento frontend, garantindo consistência, qualidade e manutenibilidade a longo prazo. A adesão aos princípios e padrões aqui delineados é mandatória para todos os membros da equipe de desenvolvimento.

### 1.2 Objetivos Estratégicos da Arquitetura

A arquitetura foi projetada para atingir quatro objetivos estratégicos principais, que guiarão todas as decisões técnicas e de implementação:

*   **Reusabilidade e Modularidade:** Construir a interface do usuário a partir de uma biblioteca de componentes independentes, reutilizáveis e bem documentados. Esta abordagem visa acelerar o desenvolvimento, reduzir a duplicação de código e garantir uma experiência de usuário consistente em toda a aplicação.
*   **Escalabilidade e Manutenibilidade:** Criar uma base de código que seja fácil de entender, modificar e estender à medida que a aplicação cresce em complexidade e funcionalidades. A arquitetura deve suportar o desenvolvimento paralelo por múltiplos engenheiros sem criar conflitos, um benefício inerente a estruturas orientadas a funcionalidades.1
*   **Performance e Experiência do Usuário (UX):** Entregar uma experiência de usuário rápida, responsiva e fluida. Isso inclui a otimização dos tempos de carregamento, a garantia de um manuseio eficiente de dados e o fornecimento de feedback visual claro para todas as interações do usuário, especialmente operações assíncronas.
*   **Consistência Visual e de Código:** Aplicar uma aparência e comportamento consistentes em toda a aplicação por meio de um Design System sistemático. Da mesma forma, impor um estilo e estrutura de codificação consistentes para melhorar a legibilidade, a colaboração e a qualidade geral do código.

### 1.3 Princípio Fundamental: Desacoplamento Total via API RESTful

O frontend é uma aplicação puramente do lado do cliente, sem dependência direta da stack tecnológica, do banco de dados ou da implementação da lógica de negócios do backend. Toda a comunicação, incluindo recuperação de dados, submissão e alterações de estado, ocorrerá exclusivamente por meio de chamadas assíncronas a uma API RESTful bem definida.

Esta abordagem de desacoplamento é a pedra angular de toda a nossa arquitetura, proporcionando benefícios estratégicos significativos. Ela concede a liberdade de escolher as melhores ferramentas e frameworks para o frontend, independentemente das tecnologias do backend. Além disso, permite que as equipes de frontend e backend trabalhem de forma independente e paralela, acelerando o tempo de lançamento no mercado. Do ponto de vista da segurança, essa separação melhora a robustez ao expor apenas as informações necessárias através de endpoints de API controlados.2

A exigência de uma arquitetura desacoplada não é meramente uma preferência técnica; é uma decisão de negócios estratégica que implica resiliência. A arquitetura do frontend deve ser projetada para ser imune a futuras mudanças no backend. Se a equipe de backend decidir refatorar um microsserviço ou substituí-lo completamente, o impacto no frontend deve ser mínimo.

Para alcançar essa resiliência, não basta simplesmente fazer chamadas de API. É imperativo evitar que as estruturas de dados e convenções de nomenclatura do backend "vazem" para os componentes da UI. Isso nos leva à necessidade de criar uma "Camada Anticorrupção" explícita dentro do próprio frontend. Esta camada protetora será implementada através de dois padrões centrais detalhados posteriormente neste documento: a **Camada de Serviço (Seção 6.1)**, que encapsula toda a lógica de comunicação da API, e o **Padrão de Mapeamento (Seção 6.2)**, que traduz os dados entre o formato da API e o formato ideal para o frontend.4 Portanto, nosso compromisso com o desacoplamento não se resume ao uso de uma biblioteca HTTP; trata-se de construir uma fronteira defensiva que protege a integridade e a manutenibilidade a longo prazo do frontend.

## 2.0 Stack Tecnológica e Ferramentas

### 2.1 Fundamentos: HTML5, CSS3, JavaScript (ECMAScript 2020+)

A aplicação será construída sobre os mais recentes padrões web estáveis para garantir ampla compatibilidade e acesso a recursos modernos dos navegadores. Todo o código JavaScript deve aderir à especificação ECMAScript 2020 ou superior.

### 2.2 Framework de UI: Análise e Recomendação

A escolha entre utilizar JavaScript puro (Vanilla JS) e um framework moderno é uma decisão arquitetural crítica com implicações diretas na produtividade do desenvolvimento e na manutenibilidade do projeto.

*   **Análise Comparativa:**
    *   **Vanilla JS:** Oferece controle máximo e zero dependências, resultando em aplicações leves e com alto desempenho para projetos de pequena escala ou com interatividade limitada.5 No entanto, para uma aplicação complexa e intensiva em dados como um CMMS — que tipicamente inclui dashboards, formulários complexos e visualizações de dados dinâmicas — gerenciar o estado da UI, a vinculação de dados (data binding) e o ciclo de vida dos componentes manualmente leva a um código repetitivo significativo, aumenta o risco de inconsistências e eleva drasticamente o custo de manutenção a longo prazo.6
    *   **Vue.js:** É um framework progressivo, reconhecido por sua curva de aprendizado suave, documentação exemplar e alto desempenho.7 Ele fornece reatividade e uma arquitetura baseada em componentes de forma nativa, abordando diretamente os desafios de construir uma aplicação de dashboard complexa. Sua estrutura de Componentes de Arquivo Único (Single-File Components) encapsula de forma elegante o template, a lógica e os estilos de um componente, promovendo uma organização de código limpa e modular.8
*   **Decisão Arquitetural:** Recomenda-se o uso do **Vue.js (Versão 3)**.
*   **Justificativa:** A análise dos protótipos e dos requisitos típicos de um sistema CMMS indica a necessidade de dashboards com atualizações em tempo real, alertas, formulários complexos e grades de dados.9 Este nível de reatividade da UI e complexidade no gerenciamento de estado é precisamente onde os frameworks modernos agregam um valor imenso. Vue.js oferece um equilíbrio ideal entre desempenho, experiência do desenvolvedor e poder, tornando-se uma escolha mais pragmática e sustentável do que Vanilla JS para um projeto desta escala.7

| Critério | Vanilla JS | Vue.js |
| --- | --- | --- |
| Curva de Aprendizado | Requer profundo conhecimento do DOM e dos padrões de JS. Alta complexidade para reatividade. | Considerada uma das curvas mais suaves entre os frameworks modernos. Documentação clara. |
| Gerenciamento de Estado | Manual. Requer a implementação de padrões customizados (e.g., Pub/Sub), propenso a erros. | Reatividade nativa. Ecossistema robusto com soluções oficiais como Pinia para estado global. |
| Performance | Potencialmente mais rápido para tarefas simples devido à ausência de abstrações. | Altamente performático, com um DOM Virtual otimizado e compilação de templates. |
| Ecossistema | Limitado a bibliotecas de propósito específico. Sem ferramentas integradas. | Ecossistema rico e maduro, incluindo roteador, gerenciador de estado e ferramentas de build. |
| Manutenibilidade | Torna-se complexo e difícil de manter em larga escala. A lógica fica espalhada. | A estrutura baseada em componentes promove código modular, organizado e de fácil manutenção. |

### 2.3 Cliente HTTP para Comunicação com API

*   **Análise Comparativa:**
    *   **Fetch API:** É nativa dos navegadores modernos, o que significa zero dependências e nenhum acréscimo ao tamanho do bundle da aplicação.10 No entanto, possui desvantagens significativas para aplicações complexas: a análise de JSON é um processo de duas etapas, e, mais criticamente, a API Fetch não rejeita a Promise em respostas com status de erro HTTP (como 404 ou 500), exigindo verificações manuais de response.ok em cada chamada, o que é repetitivo e propenso a erros.10
    *   **Axios:** É uma biblioteca de terceiros que oferece uma API mais ergonômica e poderosa. Suas principais vantagens incluem a transformação automática de JSON, tratamento de erros intuitivo (rejeita Promises em status 4xx/5xx) e, fundamentalmente, suporte nativo para interceptadores de requisição e resposta.10
*   **Decisão Arquitetural:** **Axios é o cliente HTTP mandatório para este projeto.**
*   **Justificativa:** Para uma aplicação de nível empresarial como um CMMS, os benefícios do Axios superam em muito o custo marginal de seu tamanho no bundle. A escolha do Axios não é apenas uma questão de conveniência, mas uma decisão arquitetural estratégica. Os interceptadores, por exemplo, são mais do que um simples recurso; são um habilitador arquitetural. Eles fornecem um ponto centralizado para implementar lógicas transversais (cross-cutting concerns) de forma limpa. Lógicas como a adição de tokens de autenticação, logging de requisições, tratamento global de erros (como redirecionar para a página de login em uma resposta 401) e até mesmo o monitoramento de desempenho podem ser gerenciadas nos interceptadores. Isso impede que essa lógica polua a camada de serviço ou, pior, os próprios componentes da UI, garantindo uma separação de responsabilidades mais clara e um código mais manutenível.

### 2.4 Ferramentas de Build e Linting (Sugestão)

Para garantir um fluxo de desenvolvimento moderno e a qualidade do código, as seguintes ferramentas são fortemente recomendadas:

*   **Vite:** Como ferramenta de build, devido à sua velocidade excepcional no servidor de desenvolvimento e otimizações de build para produção.
*   **ESLint e Prettier:** O uso de ESLint com uma configuração padronizada (e.g., eslint-plugin-vue) e Prettier para formatação de código é obrigatório. Isso garantirá a aplicação de um estilo de código consistente em toda a base de código, melhorando a legibilidade e a colaboração.

## 3.0 Estrutura de Diretórios e Organização do Código-Fonte

### 3.1 Filosofia: Estrutura Híbrida Orientada a Funcionalidades (Feature-Based)

Será adotada uma estrutura de diretórios híbrida que organiza os arquivos primariamente por funcionalidade ou domínio da aplicação, em vez de por tipo de arquivo. Esta abordagem, conhecida como "feature-based", melhora a escalabilidade ao manter arquivos relacionados co-localizados. Isso torna as funcionalidades autocontidas, mais fáceis de gerenciar, refatorar e testar à medida que a aplicação cresce.1

Essa filosofia de organização transforma a estrutura de diretórios em um mapa cognitivo do domínio de negócios da aplicação. Quando um desenvolvedor precisa trabalhar em "Ordens de Serviço", ele sabe que _tudo_ o que é relevante para esse domínio está contido em /src/features/work-orders. Isso reduz a carga cognitiva, acelera a integração de novos membros na equipe e alinha o modelo mental do software com a organização física do código, um catalisador poderoso para a manutenibilidade a longo prazo.

### 3.2 Estrutura de Diretórios Proposta

/  
├── public/  
│ ├── favicon.ico  
│ └── index.html  
└── src/  
├── assets/  
│ ├── fonts/  
│ ├── icons/  
│ └── images/  
├── components/  
│ ├── base/  
│ │ ├── BaseButton.vue  
│ │ ├── BaseInput.vue  
│ │ └── BaseModal.vue  
│ └── common/  
│ ├── AppHeader.vue  
│ └── AppSidebar.vue  
├── features/  
│ ├── dashboard/  
│ │ ├── components/  
│ │ │ ├── StatsCard.vue  
│ │ │ └── MaintenanceChart.vue  
│ │ └── DashboardView.vue  
│ ├── work-orders/  
│ │ ├── components/  
│ │ │ ├── WorkOrderForm.vue  
│ │ │ └── WorkOrderTable.vue  
│ │ ├── services/  
│ │ │ ├── workOrderService.js  
│ │ │ └── workOrderMapper.js  
│ │ └── WorkOrdersView.vue  
│ └──... (outras funcionalidades como assets, reports, etc.)  
├── router/  
│ └── index.js  
├── services/  
│ ├── apiService.js  
│ └── authService.js  
├── store/  
│ └── index.js  
├── styles/  
│ ├── \_variables.css  
│ ├── \_base.css  
│ ├── \_utilities.css  
│ └── main.css  
├── utils/  
│ ├── formatDate.js  
│ └── validators.js  
└── main.js  

### 3.3 Descrição das Responsabilidades de cada Diretório

*   src/assets: Armazena todos os ativos estáticos, como fontes, ícones SVG e imagens.1
*   src/components: Contém componentes de UI **compartilhados e agnósticos de domínio**. Esta é uma distinção crucial. BaseButton ou AppHeader são componentes compartilhados. Em contraste, WorkOrderTable é específico da funcionalidade de "ordens de serviço" e, portanto, reside dentro do diretório dessa funcionalidade.1
*   src/features: O coração da aplicação. Cada subdiretório representa um domínio de negócio principal (e.g., Dashboard, Ordens de Serviço). Ele contém todas as views, componentes, serviços e lógica específicos para aquela funcionalidade, tornando-a autocontida.1
*   src/router: Contém a configuração do Vue Router, definindo todas as rotas da aplicação e seus respectivos componentes de view.
*   src/services: Módulos centralizados para comunicação com serviços externos. apiService.js conterá a instância configurada do Axios e helpers genéricos. Serviços de domínio, como authService.js, também residirão aqui.1
*   src/store: Lógica de gerenciamento de estado global, utilizando Pinia. Cada arquivo representa um "store" para um domínio de estado específico (e.g., authStore.js).
*   src/styles: Arquivos CSS globais. Isso inclui a definição de variáveis (design tokens), estilos de base (normalização, tipografia), e classes utilitárias.
*   src/utils: Funções auxiliares puras e reutilizáveis que não estão atreladas a nenhum componente ou funcionalidade específica, como formatação de datas, lógica de validação ou cálculos.1

## 4.0 Design System e Estratégia de Estilização (CSS)

### 4.1 Fundamentos do Design System: Design Tokens

Para garantir a consistência visual e facilitar a manutenção e o theming, a aplicação implementará um sistema de **Design Tokens**. Estes tokens servirão como a única fonte da verdade para todos os valores de estilo (cores, espaçamento, tipografia, etc.).15

*   **Tokens Primitivos:** Representam os valores fundamentais e contextualmente agnósticos do sistema de design. Eles formam a paleta de opções disponíveis (e.g., todas as tonalidades de azul da marca). Estes tokens **não devem ser usados diretamente** nos estilos dos componentes, pois não carregam significado semântico.15
*   **Tokens Semânticos:** Atribuem um nome contextual e proposital a um token primitivo. Eles descrevem o _papel_ do token na UI (e.g., a cor de fundo de um botão primário). Os componentes devem referenciar **exclusivamente** tokens semânticos.15

A utilização de um sistema de tokens de dois níveis (primitivo e semântico) cria um contrato formal entre as equipes de design e engenharia. Quando designers e desenvolvedores concordam com um conjunto de nomes de tokens semânticos (e.g., --color-interactive-primary), esses tokens se tornam a linguagem compartilhada. Os designers utilizam esses nomes em ferramentas como o Figma, e os desenvolvedores os utilizam no CSS.18 Isso elimina a ambiguidade e o trabalho de adivinhação. Uma mudança na cor primária da marca, por exemplo, exigiria a atualização de apenas um token primitivo (--color-blue-500), e a mudança se propagaria de forma consistente e automática por toda a aplicação, tanto nos arquivos de design quanto no código.

*   Implementação com Variáveis CSS (:root)  
    Todos os design tokens serão definidos como Propriedades Customizadas CSS (Variáveis CSS) dentro de um seletor :root no arquivo src/styles/\_variables.css, tornando-os globalmente acessíveis.  
    CSS  
    /\* src/styles/\_variables.css \*/  
    :root {  
    /\* ============================================= \*/  
    /\* Primitive Tokens: A paleta de valores brutos. \*/  
    /\* NÃO USE DIRETAMENTE NOS COMPONENTES. \*/  
    /\* ============================================= \*/  
      
    /\* Cores \*/  
    \--color-blue-500: #3b82f6;  
    \--color-blue-600: #2563eb;  
    \--color-gray-100: #f3f4f6;  
    \--color-gray-800: #1f2937;  
    \--color-white: #ffffff;  
    \--color-red-500: #ef4444;  
    \--color-green-500: #22c55e;  
      
    /\* Tipografia \*/  
    \--font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;  
    \--font-size-sm: 0.875rem; /\* 14px \*/  
    \--font-size-md: 1rem; /\* 16px \*/  
    \--font-size-lg: 1.125rem; /\* 18px \*/  
      
    /\* Espaçamento \*/  
    \--spacing-2: 0.5rem; /\* 8px \*/  
    \--spacing-4: 1rem; /\* 16px \*/  
    \--spacing-6: 1.5rem; /\* 24px \*/  
      
    /\* =================================================== \*/  
    /\* Semantic Tokens: Tokens com propósito para uso na UI. \*/  
    /\* USE ESTES TOKENS NOS COMPONENTES. \*/  
    /\* =================================================== \*/  
      
    /\* Cores de Fundo \*/  
    \--color-background-page: var(--color-gray-100);  
    \--color-background-surface: var(--color-white);  
      
    /\* Cores de Texto \*/  
    \--color-text-default: var(--color-gray-800);  
    \--color-text-muted: var(--color-gray-500);  
    \--color-text-on-interactive: var(--color-white);  
      
    /\* Cores Interativas (Botões, Links) \*/  
    \--color-interactive-primary: var(--color-blue-500);  
    \--color-interactive-primary-hover: var(--color-blue-600);  
      
    /\* Cores de Feedback \*/  
    \--color-feedback-error: var(--color-red-500);  
    \--color-feedback-success: var(--color-green-500);  
      
    /\* Preenchimento (Padding) \*/  
    \--padding-button-medium: var(--spacing-2) var(--spacing-4);  
    \--padding-card: var(--spacing-6);  
    }  
    

| Token Semântico (Propósito) | Variável CSS | Token Primitivo Referenciado | Valor Bruto |
| --- | --- | --- | --- |
| Cor de fundo do botão primário | --color-interactive-primary | --color-blue-500 | #3b82f6 |
| Cor do texto padrão | --color-text-default | --color-gray-800 | #1f2937 |
| Preenchimento de um card | --padding-card | --spacing-6 | 1.5rem |
| Cor de feedback para erro | --color-feedback-error | --color-red-500 | #ef4444 |

### 4.2 Metodologia de Nomenclatura: BEM (Block, Element, Modifier)

*   **Princípios:** Todos os estilos específicos de componentes devem utilizar a convenção de nomenclatura **BEM (Block, Element, Modifier)**. Esta metodologia cria um CSS modular, explícito e livre de conflitos, ao mesmo tempo que torna a relação entre a marcação HTML e os estilos imediatamente óbvia a partir dos nomes das classes.20 Uma das maiores vantagens do BEM é que ele evita "guerras de especificidade" ao manter os seletores "planos" (geralmente uma única classe), o que previne a necessidade de seletores complexos e aninhados.23
*   **Exemplo Prático (componente card):**  
    HTML  
    <div class="card card--featured">  
    <h3 class="card\_\_title">Solicitação de Manutenção</h3>  
    <p class="card\_\_body">Gerador #3 requer inspeção.</p>  
    <button class="card\_\_button card\_\_button--primary">Ver Detalhes</button>  
    </div>  
      
    CSS  
    /\* Bloco: O componente raiz \*/  
    

.card {

background-color: var(--color-background-surface);

border: 1px solid var(--color-border-default);

padding: var(--padding-card);

}

/\* Modificador: Uma variação do bloco \*/  

.card--featured {

border-color: var(--color-interactive-primary);

}

/\* Elemento: Uma parte do bloco \*/  

.card\_\_title {

font-size: var(--font-size-lg);

color: var(--color-text-default);

}

.card\_\_body {

margin-top: var(--spacing-4);

}

.card\_\_button {

/\*... estilos base do botão no card... \*/

}

/\* Modificador de um Elemento: Uma variação do elemento \*/  

.card\_\_button--primary {

background-color: var(--color-interactive-primary);

color: var(--color-text-on-interactive);

}

\`\`\`

### 4.3 Normalização de Estilos Cross-Browser

*   **Decisão Arquitetural:** Será utilizado o **Normalize.css**.
*   **Justificativa:** Diferente de um Reset.css tradicional, que remove agressivamente todos os estilos padrão do navegador, o Normalize.css adota uma abordagem mais sutil. Ele preserva padrões úteis (como margens de cabeçalhos e estilos de lista) e, mais importante, corrige bugs e inconsistências comuns entre diferentes navegadores. Isso fornece uma base de desenvolvimento melhor e mais previsível, muitas vezes resultando em menos CSS customizado a ser escrito para alcançar um design consistente.24

## 5.0 Estratégia de Componentização e Reusabilidade

### 5.1 Identificação de Componentes a partir dos Protótipos

A análise de interfaces CMMS típicas 9 e dos protótipos visuais fornecidos leva à identificação de uma hierarquia clara de componentes, que promove a reusabilidade e a separação de responsabilidades:

*   **Componentes de Base (Átomos):** São os blocos de construção fundamentais e mais reutilizáveis da UI, desprovidos de qualquer lógica de negócio. Eles devem ser altamente configuráveis via props. Localizados em src/components/base/.
    *   **Exemplos:** BaseButton.vue, BaseInput.vue, BaseIcon.vue, BaseTag.vue, BaseModal.vue.
*   **Componentes Comuns (Moléculas/Organismos):** São componentes mais complexos, frequentemente compostos por vários componentes de base, que são utilizados em múltiplas partes da aplicação, mas ainda são agnósticos de um domínio de negócio específico. Localizados em src/components/common/.
    *   **Exemplos:** AppHeader.vue, AppSidebar.vue, DataTable.vue.
*   **Componentes de Domínio Específico (Features):** São componentes que estão intrinsecamente ligados a uma funcionalidade de negócio e não são reutilizáveis em outros contextos. Eles residem dentro do diretório de sua respectiva funcionalidade.
    *   **Exemplos:** src/features/dashboard/components/MaintenanceChart.vue, src/features/work-orders/components/WorkOrderForm.vue.

### 5.2 Padrão de Definição de Componentes (Vue Single-File Components)

Cada componente será encapsulado em um único arquivo .vue. Este formato organiza de forma limpa o template (HTML), o script (JavaScript) e os estilos (CSS) do componente em um só lugar. Para garantir o encapsulamento de estilos e prevenir que as regras de CSS de um componente afetem outros, é mandatório o uso do atributo scoped na tag <style>.

Snippet de código

<template>  
<button class="button" :class="\`button--${variant}\`">  
<slot />  
</button>  
</template>  
  
<script setup>  
defineProps({  
variant: {  
type: String,  
default: 'primary'  
}  
});  
</script>  
  
<style scoped>  
.button {  
/\* Estilos base do botão usando tokens semânticos \*/  
padding: var(--padding-button-medium);  
border-radius: var(--border-radius-medium);  
cursor: pointer;  
}  
  
.button--primary {  
background-color: var(--color-interactive-primary);  
color: var(--color-text-on-interactive);  
}  
</style>  

### 5.3 Documentação de Componentes (Sugestão)

Para projetos de média a grande escala, é altamente recomendável o uso de uma ferramenta como o **Storybook** para criar uma biblioteca de componentes interativa. Isso serve como documentação viva, facilita o desenvolvimento e o teste de componentes de forma isolada e promove a colaboração entre desenvolvedores e designers.

## 6.0 Padrões de Interação com a API RESTful

### 6.1 A Camada de Serviço (API Service Layer)

Para reforçar o desacoplamento e a separação de responsabilidades, todas as interações diretas com a API RESTful **devem** ser encapsuladas em módulos de serviço dedicados, localizados em src/services/ ou, para serviços específicos de funcionalidades, em src/features/\*/services/. **Componentes de UI estão estritamente proibidos de fazer chamadas HTTP diretas.** Esta prática desacopla a UI dos detalhes de implementação da busca de dados, tornando o código mais organizado, testável e fácil de refatorar.29

*   **apiService.js:** Este arquivo central exportará uma instância pré-configurada do Axios. Ele será responsável por definir a baseURL da API e gerenciar interceptadores para tarefas globais, como autenticação e tratamento de erros.  
    JavaScript  
    // src/services/apiService.js  
    import axios from 'axios';  
      
    const apiClient = axios.create({  
    baseURL: import.meta.env.VITE\_API\_URL, // Obtido de variáveis de ambiente  
    headers: {  
    'Content-Type': 'application/json',  
    }  
    });  
      
    // Interceptor para adicionar o token de autenticação a cada requisição  
    apiClient.interceptors.request.use(config => {  
    const token = localStorage.getItem('authToken');  
    if (token) {  
    config.headers.Authorization = \`Bearer ${token}\`;  
    }  
    return config;  
    }, error => {  
    return Promise.reject(error);  
    });  
      
    export default apiClient;  
    
*   **Serviços de Domínio Específico:** Módulos de serviço para domínios de negócio específicos importarão a instância apiClient e exportarão funções que encapsulam cada endpoint.  
    JavaScript  
    // src/features/work-orders/services/workOrderService.js  
    import apiClient from '@/services/apiService';  
    import { mapApiWorkOrderToUiWorkOrder } from './workOrderMapper';  
      
    export const workOrderService = {  
    async getWorkOrders() {  
    const response = await apiClient.get('/work-orders');  
    // Aplica o mapeamento para transformar os dados antes de retorná-los  
    return response.data.map(mapApiWorkOrderToUiWorkOrder);  
    },  
      
    async getWorkOrderById(id) {  
    const response = await apiClient.get(\`/work-orders/${id}\`);  
    return mapApiWorkOrderToUiWorkOrder(response.data);  
    },  
      
    //... outros métodos como createWorkOrder, updateWorkOrder, etc.  
    };  
    

### 6.2 Padrão de Mapeamento de Dados (Mapper Pattern)

*   **Justificativa:** A estrutura dos dados recebidos da API raramente é ideal para consumo direto na UI. Ela pode usar convenções de nomenclatura diferentes (e.g., snake\_case), incluir campos irrelevantes, ou representar dados em formatos que necessitam de processamento (e.g., datas como strings ISO, valores monetários como centavos).4 Para criar a "Camada Anticorrupção" resiliente mencionada anteriormente, é **mandatório** o uso de funções de mapeamento para transformar os dados da API em modelos limpos, previsíveis e otimizados para a UI.  
    A ausência de mapeadores levaria a lógica de transformação de dados (análise de datas, conversão de formatos, mudança de case) a se espalhar por dezenas de componentes da UI. Isso seria uma violação grave do Princípio da Responsabilidade Única, pois cada componente seria responsável tanto pela renderização da UI quanto pela transformação de dados. Ao impor o Padrão de Mapeamento, essa lógica é forçada a um local único e dedicado. Isso torna os componentes mais "burros" e focados puramente na apresentação, e torna a lógica de transformação de dados explícita, centralizada e facilmente testável, resultando em uma melhoria profunda na qualidade e manutenibilidade do código.
*   **Implementação:** Para cada entidade de dados complexa, um arquivo ...Mapper.js será criado. Este arquivo exportará uma função que recebe um objeto da API como entrada e retorna um objeto otimizado para a UI.  
    JavaScript  
    // src/features/work-orders/services/workOrderMapper.js  
      
    /\*\*  
    \* Transforma um objeto de ordem de serviço da API para o formato da UI.  
    \* @param {object} apiWorkOrder - O objeto de ordem de serviço vindo da API.  
    \* @returns {object} O objeto de ordem de serviço formatado para a UI.  
    \*/  
    export function mapApiWorkOrderToUiWorkOrder(apiWorkOrder) {  
    return {  
    id: apiWorkOrder.id,  
    title: apiWorkOrder.title\_text, // snake\_case -> camelCase  
    assignedTo: apiWorkOrder.assigned\_user\_name, // Campo pode ser diferente  
    status: apiWorkOrder.current\_status,  
    priority: apiWorkOrder.priority\_level,  
    // Transforma tipos de dados  
    createdDate: new Date(apiWorkOrder.creation\_date),  
    // Adiciona propriedades computadas  
    isOverdue: apiWorkOrder.due\_date? new Date(apiWorkOrder.due\_date) < new Date() : false,  
    };  
    }  
    

### 6.3 Gerenciamento de Estados da UI em Requisições

Para fornecer uma experiência de usuário consistente e informativa, todas as operações assíncronas devem representar visualmente três estados possíveis: loading (carregando), success (sucesso) e error (erro). O padrão recomendado é que os métodos de busca de dados dentro dos componentes gerenciem essas variáveis de estado.

JavaScript

// Dentro da tag <script setup> de um componente Vue  
import { ref, onMounted } from 'vue';  
import { workOrderService } from '@/features/work-orders/services/workOrderService';  
  
const workOrders = ref();  
const isLoading = ref(false);  
const error = ref(null);  
  
async function fetchWorkOrders() {  
isLoading.value = true;  
error.value = null;  
try {  
workOrders.value = await workOrderService.getWorkOrders();  
} catch (err) {  
error.value = 'Falha ao carregar as ordens de serviço. Tente novamente mais tarde.';  
console.error(err); // Logar o erro real para depuração  
} finally {  
isLoading.value = false;  
}  
}  
  
onMounted(fetchWorkOrders);  

O template do componente pode então usar diretivas como v-if, v-else-if e v-else para renderizar condicionalmente um spinner de carregamento, uma mensagem de erro ou os dados obtidos com sucesso.

## 7.0 Gerenciamento de Estado da Aplicação

### 7.1 Abordagem para Estado Global

Enquanto a reatividade nativa do Vue gerencia eficientemente o estado local dos componentes, uma solução centralizada é necessária para o estado global — dados que precisam ser compartilhados entre componentes que não têm uma relação direta de pai-filho. Exemplos incluem dados do usuário autenticado, configurações da aplicação ou notificações globais.

*   **Decisão Arquitetural:** Será utilizada a **Pinia**, a biblioteca oficial de gerenciamento de estado para Vue 3. Ela oferece uma API simples, com forte tipagem, e excelente integração com as ferramentas de desenvolvimento do Vue (Vue DevTools) para definir "stores" centralizadas.

### 7.2 Estrutura de uma Store Pinia

Uma "store" será definida para cada domínio principal de estado global. Esta abordagem mantém o estado global organizado e modular.

*   **Justificativa:** Utilizar uma biblioteca padrão e bem suportada como a Pinia é vastamente superior a criar uma solução de gerenciamento de estado customizada (como um sistema Pub/Sub manual) ao usar um framework como o Vue. A Pinia integra-se perfeitamente ao sistema de reatividade do framework e às suas ferramentas de desenvolvimento, fornecendo uma solução mais robusta, testável e manutenível.6 Os princípios do padrão Pub/Sub (desacoplar as alterações de estado dos componentes que reagem a elas) são efetivamente implementados pela Pinia de forma otimizada e transparente para o desenvolvedor.

JavaScript

// src/store/authStore.js  
import { defineStore } from 'pinia';  
import { authService } from '@/services/authService'; // Supondo que exista um authService  
  
export const useAuthStore = defineStore('auth', {  
// O 'state' é a fonte da verdade central para os dados de autenticação.  
state: () => ({  
user: null,  
token: localStorage.getItem('authToken') |  
  
| null,  
status: 'idle', // 'idle', 'loading', 'error'  
}),  
  
// 'getters' são como propriedades computadas para as stores.  
getters: {  
isAuthenticated: (state) =>!!state.user,  
userName: (state) => state.user?.name |  
  
| 'Visitante',  
},  
  
// 'actions' são métodos que podem ser chamados para modificar o estado.  
// Elas podem ser assíncronas.  
actions: {  
async login(credentials) {  
this.status = 'loading';  
try {  
const { user, token } = await authService.login(credentials);  
  
this.user = user;  
this.token = token;  
localStorage.setItem('authToken', token);  
  
this.status = 'idle';  
} catch (error) {  
this.status = 'error';  
throw error; // Propaga o erro para o componente da UI tratar  
}  
},  
  
logout() {  
this.user = null;  
this.token = null;  
localStorage.removeItem('authToken');  
// Redirecionar para a página de login, se necessário  
}  
}  
});  

#### Referências citadas

1.  Best React Folder Structure Guide for Scalable Projects - CodingCops, acessado em outubro 17, 2025, [https://codingcops.com/react-folder-structure-best-practices-for-scalable-apps/](https://codingcops.com/react-folder-structure-best-practices-for-scalable-apps/)
2.  How to Build a Decoupled Architecture for Your Website - PixelFreeStudio Blog, acessado em outubro 17, 2025, [https://blog.pixelfreestudio.com/how-to-build-a-decoupled-architecture-for-your-website/](https://blog.pixelfreestudio.com/how-to-build-a-decoupled-architecture-for-your-website/)
3.  Headless Architecture: Benefits, Best Practices, Challenges, and Use Cases, acessado em outubro 17, 2025, [https://crystallize.com/blog/headless-architecture](https://crystallize.com/blog/headless-architecture)
4.  Decoupling API and UI Models with Mappers: A Developer's Guide to Cleaner Architecture | by Kennedy Owusu | Aug, 2025 | JavaScript in Plain English, acessado em outubro 17, 2025, [https://javascript.plainenglish.io/decoupling-api-and-ui-models-with-mappers-a-developers-guide-to-cleaner-architecture-0ec941c82efa](https://javascript.plainenglish.io/decoupling-api-and-ui-models-with-mappers-a-developers-guide-to-cleaner-architecture-0ec941c82efa)
5.  What is the difference between Vanilla.js and Vue.js? - Lemon.io, acessado em outubro 17, 2025, [https://lemon.io/answers/vanilla-js/what-is-the-difference-between-vanilla-js-and-vue-js/](https://lemon.io/answers/vanilla-js/what-is-the-difference-between-vanilla-js-and-vue-js/)
6.  How do you manage 'state' with vanilla js? : r/javascript - Reddit, acessado em outubro 17, 2025, [https://www.reddit.com/r/javascript/comments/9cdxwt/how\_do\_you\_manage\_state\_with\_vanilla\_js/](https://www.reddit.com/r/javascript/comments/9cdxwt/how_do_you_manage_state_with_vanilla_js/)
7.  Which JavaScript framework is best (React or Vue in 2025?) - DEV Community, acessado em outubro 17, 2025, [https://dev.to/codewithshahan/which-javascript-framework-is-best-react-or-vue-1iaj/comments](https://dev.to/codewithshahan/which-javascript-framework-is-best-react-or-vue-1iaj/comments)
8.  Best JavaScript Frameworks in 2025 (Extensive Comparison), acessado em outubro 17, 2025, [https://prerender.io/blog/best-javascript-frameworks-pros-cons-and-statistics/](https://prerender.io/blog/best-javascript-frameworks-pros-cons-and-statistics/)
9.  The Role of UI/UX in Modern CMMS, acessado em outubro 17, 2025, [https://www.clickmaint.com/blog/the-role-of-ui/ux-in-modern-cmms](https://www.clickmaint.com/blog/the-role-of-ui/ux-in-modern-cmms)
10.  Fetch API vs Axios: Which One Should You Use in 2025? - DEV ..., acessado em outubro 17, 2025, [https://dev.to/mechcloud\_academy/fetch-api-vs-axios-which-one-should-you-use-in-2025-2c37](https://dev.to/mechcloud_academy/fetch-api-vs-axios-which-one-should-you-use-in-2025-2c37)
11.  Fetch vs. Axios: Which One Should You Use | by sky - Medium, acessado em outubro 17, 2025, [https://medium.com/@skyshots/fetch-vs-axios-which-one-should-you-use-d5473c65d4d8](https://medium.com/@skyshots/fetch-vs-axios-which-one-should-you-use-d5473c65d4d8)
12.  Axios vs Fetch: Which HTTP Client to Choose in JS? - Scrapfly, acessado em outubro 17, 2025, [https://scrapfly.io/blog/posts/axios-vs-fetch](https://scrapfly.io/blog/posts/axios-vs-fetch)
13.  Axios vs Fetch API: The Definitive Guide to HTTP Requests in 2025 - OpenReplay Blog, acessado em outubro 17, 2025, [https://blog.openreplay.com/axios-vs-fetch-api-guide-http-requests-2025/](https://blog.openreplay.com/axios-vs-fetch-api-guide-http-requests-2025/)
14.  Creating scalable and maintainable front-end architecture - Finaps, acessado em outubro 17, 2025, [https://finaps.nl/creating-scalable-and-maintainable-front-end-architecture/](https://finaps.nl/creating-scalable-and-maintainable-front-end-architecture/)
15.  Update 1: Tokens, variables, and styles – Figma Learn - Help Center, acessado em outubro 17, 2025, [https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles)
16.  Styled Mode - PrimeVue, acessado em outubro 17, 2025, [https://primevue.org/theming/styled/](https://primevue.org/theming/styled/)
17.  Design token usage | Calcite Design System - Esri Developer, acessado em outubro 17, 2025, [https://developers.arcgis.com/calcite-design-system/foundations/tokens/usage/](https://developers.arcgis.com/calcite-design-system/foundations/tokens/usage/)
18.  Syncing Figma Variables to CSS Variables - Tony Ward, acessado em outubro 17, 2025, [https://www.tonyward.dev/articles/figma-variables-to-css-variables](https://www.tonyward.dev/articles/figma-variables-to-css-variables)
19.  How to create and use Figma's design tokens in CSS? - Bootstrapped, acessado em outubro 17, 2025, [https://bootstrapped.app/guide/how-to-create-and-use-figmas-design-tokens-in-css](https://bootstrapped.app/guide/how-to-create-and-use-figmas-design-tokens-in-css)
20.  BEM Methodology: A Step-by-Step Guide for Beginners, acessado em outubro 17, 2025, [https://www.valoremreply.com/resources/insights/guide/bem-methodology-a-step-by-step-guide-for-beginners/](https://www.valoremreply.com/resources/insights/guide/bem-methodology-a-step-by-step-guide-for-beginners/)
21.  CSS BEM Model – A Guide to Writing Scalable and Maintainable CSS - DEV Community, acessado em outubro 17, 2025, [https://dev.to/ridoy\_hasan/css-bem-model-a-guide-to-writing-scalable-and-maintainable-css-o1i](https://dev.to/ridoy_hasan/css-bem-model-a-guide-to-writing-scalable-and-maintainable-css-o1i)
22.  BEM — Naming, acessado em outubro 17, 2025, [https://getbem.com/naming/](https://getbem.com/naming/)
23.  BEM 101 - CSS-Tricks, acessado em outubro 17, 2025, [https://css-tricks.com/bem-101/](https://css-tricks.com/bem-101/)
24.  www.geeksforgeeks.org, acessado em outubro 17, 2025, [https://www.geeksforgeeks.org/css/difference-between-resetting-and-normalizing-in-css/#:~:text=CSS%20Reset%20provides%20a%20clean,browsers%20without%20stripping%20everything%20away.](https://www.geeksforgeeks.org/css/difference-between-resetting-and-normalizing-in-css/#:~:text=CSS%20Reset%20provides%20a%20clean,browsers%20without%20stripping%20everything%20away.)
25.  What's the difference between "resetting" and "normalizing" CSS? - GreatFrontEnd, acessado em outubro 17, 2025, [https://www.greatfrontend.com/questions/quiz/whats-the-difference-between-resetting-and-normalizing-css-which-would-you-choose-and-why](https://www.greatfrontend.com/questions/quiz/whats-the-difference-between-resetting-and-normalizing-css-which-would-you-choose-and-why)
26.  What is the difference between Normalize.css and Reset CSS ..., acessado em outubro 17, 2025, [https://stackoverflow.com/questions/6887336/what-is-the-difference-between-normalize-css-and-reset-css](https://stackoverflow.com/questions/6887336/what-is-the-difference-between-normalize-css-and-reset-css)
27.  What is the difference between using normalize.css or Eric Meyer reset stylesheet? - Reddit, acessado em outubro 17, 2025, [https://www.reddit.com/r/webdev/comments/94vui2/what\_is\_the\_difference\_between\_using\_normalizecss/](https://www.reddit.com/r/webdev/comments/94vui2/what_is_the_difference_between_using_normalizecss/)
28.  Common UI elements - ServiceNow, acessado em outubro 17, 2025, [https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/use/common-ui-elements/topic/p\_CommonUIElements.html](https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/use/common-ui-elements/topic/p_CommonUIElements.html)
29.  Design patterns for modern web APIs | by David Luecke | The Feathers Flightpath, acessado em outubro 17, 2025, [https://blog.feathersjs.com/design-patterns-for-modern-web-apis-1f046635215](https://blog.feathersjs.com/design-patterns-for-modern-web-apis-1f046635215)
30.  Frontend API Management: Strategies for Modern Web Applications | by Sam Li - Medium, acessado em outubro 17, 2025, [https://wslisam.medium.com/frontend-api-management-strategies-for-modern-web-applications-89f677761123](https://wslisam.medium.com/frontend-api-management-strategies-for-modern-web-applications-89f677761123)