# Dossiê Técnico: Biblioteca de Componentes de Base - CMMS Pro

## 1.0 Princípios Fundamentais da Biblioteca

Esta seção estabelece as regras arquiteturais e os princípios de design que governam cada componente dentro da biblioteca CMMS Pro. Estes princípios são mandatórios e servem como a fundação para garantir a consistência, reutilização, manutenibilidade e acessibilidade em toda a aplicação. A aderência estrita a estas diretrizes é essencial para o sucesso do sistema de design e para a geração de código automatizada.

### 1.1 Agnosticismo de Domínio

O princípio fundamental da biblioteca de componentes de base é o completo agnosticismo de domínio. Os componentes são concebidos como primitivos de UI, cuja única responsabilidade é resolver problemas de interface de usuário de baixo nível, como capturar texto, exibir um estado ou acionar uma ação. Eles são, por definição, desprovidos de qualquer conhecimento sobre o contexto de negócio do CMMS em que serão utilizados.1

Esta abordagem está alinhada com arquiteturas de componentes em camadas, onde esta biblioteca constitui a camada de "Styled Primitives" (Primitivos Estilizados).3 A aplicação CMMS, por sua vez, construirá sua camada de "Domain-specific Components" (Componentes de Domínio Específico) compondo estes componentes de base para adicionar lógica de negócio, estado da aplicação e contexto.

A separação formal de responsabilidades entre a UI e a lógica de negócio oferece benefícios arquiteturais significativos:

*   **Manutenibilidade Aprimorada:** Isolar a lógica de UI em componentes de base puros torna-os mais fáceis de manter e testar. A lógica de negócio, que é mais volátil, reside em componentes de domínio, minimizando o impacto de mudanças nos componentes fundamentais.3
*   **Reutilização e Escalabilidade:** Componentes agnósticos podem ser reutilizados em diferentes contextos dentro da aplicação (e potencialmente em outras aplicações) sem modificação. Isso acelera o desenvolvimento e garante consistência visual e comportamental.1
*   **Desenvolvimento Paralelo:** Equipes podem trabalhar de forma independente na biblioteca de base e nos componentes de domínio, utilizando a API dos componentes de base como um contrato estável.

**Implementação Mandatória:** Nenhum arquivo de componente (.vue) dentro desta biblioteca pode conter importações ou referências a módulos de nível de aplicação, como stores Pinia, instâncias do Vue Router, ou qualquer lógica ou texto fixo relacionado a conceitos do CMMS (ex: "Ordem de Serviço", "Ativo", "Técnico"). Todos os dados, rótulos e conteúdo contextual devem ser injetados exclusivamente através de props e slots.

### 1.2 Configuração via Props

A interface pública e o comportamento de cada componente são definidos e controlados exclusivamente através de suas props. As props constituem a API primária de um componente, permitindo que seu estado, dados e variações sejam configurados de forma declarativa pelo componente pai.5

As seguintes melhores práticas de design de API de props são mandatórias:

*   **Clareza e Previsibilidade:** Os nomes das props devem ser intuitivos, auto-documentados e baseados na propriedade ou comportamento que controlam, não em detalhes de implementação. A nomenclatura deve ser consistente em toda a biblioteca.5 Por exemplo, a propriedade para desabilitar um componente deve ser sempre disabled.
*   **Enums em vez de Booleanos para Variantes:** Para um conjunto de opções mutuamente exclusivas (ex: variantes de cor, tamanhos), deve-se usar uma única prop do tipo String com um conjunto definido de valores literais, em vez de múltiplas props booleanas. Por exemplo, variant: 'primary' | 'secondary' é preferível a isPrimary: Boolean e isSecondary: Boolean. Esta prática previne estados impossíveis ou conflitantes e resulta em uma API mais limpa e explícita.7
*   **Fluxo de Dados Unidirecional:** Os componentes são estritamente proibidos de mutar suas próprias props. Este é um princípio central do Vue que garante um fluxo de dados previsível.6 Se o valor de uma prop for necessário como ponto de partida para um estado local e mutável, seu valor deve ser copiado para uma ref ou reactive local dentro do bloco <script setup>. Para transformar o valor de uma prop para exibição, uma computed property deve ser utilizada.
*   **Validação de Props:** Todas as props devem ter tipos explícitos (String, Number, Boolean, Array, Object). Para props que aceitam um conjunto restrito de valores de string, um validator deve ser implementado para reforçar o contrato. Valores default devem ser fornecidos para todas as props não obrigatórias.

A criação de uma API de props rigorosa e bem projetada é fundamental para uma boa experiência do desenvolvedor e essencial para a precisão da IA de geração de código. Ao impor padrões como o uso de enums, o espaço de estados de um componente torna-se explícito e finito, permitindo que a IA mapeie deterministicamente os valores das props para modificadores BEM e atributos ARIA.

### 1.3 Customização via Slots

Enquanto as props configuram o comportamento e os dados de um componente, os slots são o mecanismo designado para a injeção de conteúdo e estrutura customizados. Este padrão permite que os componentes de base permaneçam estruturalmente simples e agnósticos em relação ao seu conteúdo, capacitando os desenvolvedores da aplicação a criar composições complexas e específicas do domínio.8

Os seguintes tipos de slots serão utilizados com propósitos específicos:

*   **Slot Padrão (<slot />):** Reservado para a área de conteúdo principal e mais comum de um componente. Exemplos incluem o texto dentro de um BaseButton ou a mensagem principal de um BaseAlert.
*   **Slots Nomeados (<slot name="..." />):** Utilizados para pontos de extensão específicos e predefinidos no template de um componente. Eles fornecem "ganchos" composicionais sem quebrar o layout principal do componente. Exemplos: header e footer em um BaseCard; icon para injetar um ícone customizado em um BaseButton.9
*   **Slots com Escopo (<slot :data="childData" />):** Este é o padrão arquitetural chave para componentes orientados a dados, como BaseTable e BaseList. O componente de base gerencia a iteração sobre os dados e a lógica de apresentação (ex: ordenação, paginação), mas delega a renderização final de cada item de volta ao componente pai, passando os dados do item através do escopo do slot. Isso permite que o pai injete componentes de domínio e renderize os dados de uma maneira específica ao contexto da aplicação.8

A combinação estratégica de slots nomeados e com escopo é o que permite que componentes complexos, como BaseTable, permaneçam verdadeiramente agnósticos. A responsabilidade do BaseTable termina na renderização da estrutura da tabela e no gerenciamento dos dados; a responsabilidade de renderizar o conteúdo de cada célula (<td>) é totalmente delegada ao consumidor.

### 1.4 Estilização com Design Tokens e BEM

A estilização dos componentes é completamente desacoplada de sua lógica e estrutura. Os componentes são responsáveis apenas por renderizar a estrutura DOM correta e aplicar classes CSS semânticas. Todas as propriedades visuais (cores, espaçamentos, tipografia, etc.) são controladas externamente através de Variáveis CSS, também conhecidas como Design Tokens.11

*   **Variáveis CSS (Design Tokens):** Cada valor de propriedade CSS que pertence ao tema visual (color, background-color, font-size, padding, border-radius, etc.) DEVE ser definido usando uma variável CSS com um nome semântico (ex: background-color: var(--color-background-button-primary);). Nenhum valor de estilo "mágico" (ex: #FFFFFF, 16px) é permitido dentro dos estilos escopados do componente.
*   **Metodologia BEM (Block\_\_Element--Modifier):** A convenção de nomenclatura BEM é mandatória para todas as classes CSS. Isso garante uma estrutura de classes plana, de baixa especificidade e livre de conflitos, ideal para um sistema de componentes.11
    *   **Block:** O elemento raiz do componente. A classe deve ser em kebab-case e prefixada com base- (ex: .base-card).
    *   **Element:** Uma parte constituinte de um bloco. A classe é formada pelo nome do bloco, dois underscores e o nome do elemento (ex: .base-card\_\_header).
    *   **Modifier:** Uma variante ou estado de um bloco ou elemento, derivada diretamente de uma prop. A classe é formada pelo nome do bloco ou elemento, dois hifens e o nome do modificador (ex: .base-button--variant-primary, .base-button--disabled).
*   **Estilos Escopados (<style scoped>):** O uso do atributo scoped na tag <style> dos Single File Components (SFCs) do Vue é obrigatório para encapsular os estilos e prevenir vazamentos que poderiam afetar outros componentes.

A sinergia entre BEM e Variáveis CSS cria um sistema de estilização robusto e temático. O BEM fornece os "ganchos" estruturais e semânticos, enquanto as Variáveis CSS funcionam como a API para o tema. Isso significa que a identidade visual completa da aplicação CMMS pode ser alterada fornecendo um conjunto diferente de valores de tokens, sem modificar a biblioteca de componentes.

### 1.5 Acessibilidade (A11y) como Requisito

A acessibilidade não é opcional; é um requisito fundamental para cada componente. Todos os componentes devem ser implementados em conformidade com os padrões relevantes do WAI-ARIA Authoring Practices Guide (APG), garantindo que sejam perceptíveis, operáveis e compreensíveis para todos os usuários, incluindo aqueles que dependem de tecnologias assistivas.14

Os seguintes pontos de verificação são mandatórios:

*   **HTML Semântico:** Utilizar elementos HTML nativos (<button>, <input>, <label>, <nav>) sempre que sua semântica corresponder à função do componente. ARIA deve ser usada para aprimorar a semântica nativa ou para criar widgets não disponíveis em HTML, não para substituí-la.15
*   **Atributos ARIA (Roles, States, and Properties):** A especificação de cada componente definirá explicitamente o padrão ARIA que ele deve seguir. Isso inclui a aplicação dos roles corretos (ex: role="dialog"), estados (ex: aria-expanded, aria-checked, aria-disabled) e propriedades (ex: aria-labelledby, aria-controls, aria-modal).
*   **Nomenclatura Acessível:** Todos os elementos interativos devem ter um nome acessível. Para campos de formulário, isso é alcançado associando um <label> através dos atributos for e id. Para controles não textuais, como botões de ícone, um aria-label deve ser fornecido.
*   **Navegação por Teclado:** Toda a funcionalidade deve ser operável via teclado. Isso inclui a navegação padrão com Tab / Shift+Tab e interações específicas de widgets definidas pelos padrões ARIA, como navegação com setas em BaseRadioGroup e BaseTabs.17
*   **Gerenciamento de Foco:** O gerenciamento de foco deve ser lógico e previsível. Os estados de foco devem ser sempre visualmente aparentes. Componentes modais (BaseModal) devem aprisionar o foco do teclado em seu interior até serem fechados.19 Ao dispensar um componente, o foco deve retornar de forma inteligente ao elemento que o acionou.

Ao vincular formalmente a especificação de cada componente a um padrão WAI-ARIA específico, transformamos um requisito abstrato ("ser acessível") em um conjunto concreto e verificável de regras de implementação, eliminando ambiguidades para a IA geradora de código.

### 1.6 Emissão de Eventos

A comunicação de um componente filho para seu pai deve ocorrer exclusivamente através da emissão de eventos, declarados explicitamente com a macro defineEmits. Isso cria um contrato claro para toda a comunicação de saída.

*   **Convenção de Nomenclatura:** Os nomes dos eventos devem ser declarados em camelCase no array defineEmits (ex: update:modelValue) e escutados usando kebab-case no template do pai (ex: @update:model-value).
*   **Suporte a v-model:** Para fornecer uma interface v-model padrão, que é obrigatória para todos os componentes de entrada de dados, o componente DEVE:
    1.  Aceitar uma prop chamada modelValue.
    2.  Emitir um evento chamado update:modelValue, com o novo valor como payload, sempre que uma interação do usuário deva alterar o estado vinculado.
*   **Payloads de Eventos:** Os payloads devem ser limpos e previsíveis. Em vez de emitir o objeto de evento DOM bruto, o componente deve emitir o valor primitivo ou o objeto de dados relevante (ex: em uma mudança do BaseSelect, emitir o value selecionado, não o evento de clique).

A padronização da implementação do v-model em todos os componentes de formulário é crucial para criar uma biblioteca coesa e intuitiva, que se integra perfeitamente ao ecossistema Vue e simplifica o desenvolvimento de formulários na aplicação.

## 2.0 Inventário Completo de Componentes de Base

Esta seção detalha a especificação técnica completa para cada componente da biblioteca de base, organizada por categoria funcional. Cada especificação serve como um blueprint preciso para a geração de código automatizada.

### 2.1 Categoria: Formulários (Entrada de Dados)

#### Componente: BaseInput.vue

**Descrição:** Um componente de entrada de texto fundamental que encapsula um elemento <input> nativo. É a base para capturar dados de texto, senhas, e-mails, entre outros, de forma controlada e acessível.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| modelValue | String, Number | '' | O valor do campo de entrada. Usado para v-model. |
| type | String | 'text' | O tipo do elemento <input> nativo. Aceita: 'text', 'password', 'email', 'number', 'tel', 'url'. |
| label | String | '' | O texto do rótulo associado ao campo. Essencial para acessibilidade. |
| placeholder | String | '' | Texto de ajuda exibido no campo quando ele está vazio. |
| disabled | Boolean | false | Se true, desabilita o campo para interação. |
| readonly | Boolean | false | Se true, o campo não pode ser editado, mas pode ser focado e seu valor selecionado. |
| status | String | undefined | Define o estado de validação visual. Aceita: 'error', 'warning'. |
| id | String | undefined | ID único para o elemento <input>. Se não fornecido, um ID será gerado automaticamente para associar ao label. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| prefix | Conteúdo a ser exibido dentro do campo, antes do valor (geralmente um ícone). |
| suffix | Conteúdo a ser exibido dentro do campo, depois do valor (geralmente um ícone). |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:modelValue | String | Number | Emitido a cada alteração no valor do campo para suportar v-model. |
| change | Event | Emitido quando o valor do campo é alterado e o campo perde o foco. |
| blur | FocusEvent | Emitido quando o campo perde o foco. |
| focus | FocusEvent | Emitido quando o campo ganha foco. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA para Textbox.20

*   O elemento <label> deve ser associado ao <input> através dos atributos for e id.
*   O atributo aria-required="true" deve ser aplicado se a prop required (a ser adicionada em um contexto de formulário) for verdadeira.
*   O atributo aria-invalid="true" deve ser aplicado quando a prop status for 'error'.
*   O atributo aria-disabled="true" deve ser aplicado quando a prop disabled for true.

**Exemplo de Uso:**

HTML

<BaseInput  
v-model="form.name"  
label="Nome Completo"  
placeholder="Digite seu nome"  
type="text"  
status="error"  
\>  
<template #prefix>  
<IconUser />  
</template>  
</BaseInput>  

#### Componente: BaseTextarea.vue

**Descrição:** Um componente para entrada de texto de múltiplas linhas, encapsulando o elemento <textarea> nativo. Ideal para campos de descrição, comentários ou qualquer texto longo.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| modelValue | String | '' | O valor do campo de texto. Usado para v-model. |
| label | String | '' | O texto do rótulo associado ao campo. |
| placeholder | String | '' | Texto de ajuda exibido no campo quando ele está vazio. |
| disabled | Boolean | false | Se true, desabilita o campo para interação. |
| readonly | Boolean | false | Se true, o campo não pode ser editado. |
| status | String | undefined | Define o estado de validação visual. Aceita: 'error', 'warning'. |
| rows | Number | 3 | O número de linhas visíveis do campo de texto. |
| autoResize | Boolean | false | Se true, o campo de texto se ajustará verticalmente ao conteúdo. |
| id | String | undefined | ID único para o elemento <textarea>. Se não fornecido, um ID será gerado. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| (nenhum) | Este componente não possui slots customizáveis. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:modelValue | String | Emitido a cada alteração no valor do campo para suportar v-model. |

Acessibilidade:

Semelhante ao BaseInput, mas com a adição obrigatória do atributo aria-multiline="true" no elemento <textarea>.20

*   O elemento <label> deve ser associado ao <textarea> através dos atributos for e id.
*   aria-invalid="true" deve ser aplicado quando status for 'error'.
*   aria-disabled="true" deve ser aplicado quando disabled for true.

**Exemplo de Uso:**

HTML

<BaseTextarea  
v-model="form.description"  
label="Descrição da Tarefa"  
placeholder="Detalhe os passos necessários..."  
:rows="5"  
auto-resize  
/>  

#### Componente: BaseSelect.vue

**Descrição:** Um componente de seleção que permite ao usuário escolher uma ou mais opções de uma lista. Encapsula a complexidade de um dropdown customizado, garantindo acessibilidade e uma API simples.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| modelValue | String, Number, Array | undefined | O valor(es) selecionado(s). Usado para v-model. O tipo depende do modo. |
| options | Array | `` | Array de objetos para popular as opções. Cada objeto deve ter label (String) e value (String | Number), e opcionalmente disabled (Boolean). |
| label | String | '' | O texto do rótulo associado ao seletor. |
| placeholder | String | 'Selecione uma opção' | Texto exibido quando nenhum valor está selecionado. |
| disabled | Boolean | false | Se true, desabilita o seletor. |
| mode | String | 'single' | Modo de seleção. Aceita: 'single', 'multiple'. |
| loading | Boolean | false | Se true, exibe um indicador de carregamento, útil para buscas assíncronas. |
| id | String | undefined | ID único para o componente. Se não fornecido, um ID será gerado. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| option | Slot com escopo para customizar a renderização de cada item da lista. Recebe { option, index } como propriedades. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:modelValue | String | Number | Array | Emitido quando o valor selecionado muda, para suportar v-model. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Combobox.22

*   O elemento gatilho deve ter role="combobox", aria-haspopup="listbox" e aria-expanded (dinâmico).
*   A lista de opções deve ter role="listbox".
*   Cada opção deve ter role="option" e aria-selected (dinâmico).
*   Deve haver uma associação entre o gatilho e a lista via aria-controls.
*   A navegação por teclado (setas para cima/baixo, Enter para selecionar, Esc para fechar) é mandatória.

**Exemplo de Uso:**

HTML

<BaseSelect  
v-model="form.technicianId"  
label="Técnico Responsável"  
:options=""  
placeholder="Atribuir a..."  
/>  

#### Componente: BaseCheckbox.vue

**Descrição:** Um controle que permite ao usuário selecionar um ou mais itens. Pode representar um valor booleano ou um item dentro de um grupo de seleções.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| modelValue | Boolean, Array | false | O estado do checkbox. Usado com v-model. Se usado em grupo, o modelValue deve ser um Array. |
| label | String | '' | O texto do rótulo exibido ao lado do checkbox. |
| value | String, Number | undefined | O valor associado a este checkbox, necessário quando usado em um grupo. |
| disabled | Boolean | false | Se true, desabilita o checkbox. |
| indeterminate | Boolean | false | Define o estado visual como indeterminado (nem marcado, nem desmarcado). O modelValue não é afetado. |
| id | String | undefined | ID único para o elemento <input>. Se não fornecido, um ID será gerado. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | Permite injetar conteúdo complexo no lugar do label da prop. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:modelValue | Boolean | Array | Emitido quando o estado do checkbox muda, para suportar v-model. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Checkbox.24

*   O elemento interativo deve ter role="checkbox".
*   O estado deve ser comunicado via aria-checked. Para o estado indeterminado, aria-checked="mixed" deve ser usado.
*   O rótulo deve ser associado ao controle.
*   A tecla Espaço deve alternar o estado de seleção.

**Exemplo de Uso:**

HTML

<BaseCheckbox v-model="form.notifications" label="Receber notificações por e-mail" />  
  
<BaseCheckbox :indeterminate="isIndeterminate" v-model="checkAll" label="Selecionar Todos" />  

#### Componente: BaseRadioGroup.vue

**Descrição:** Um componente para agrupar múltiplos botões de rádio, permitindo que o usuário selecione apenas uma opção de um conjunto.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| modelValue | String, Number | undefined | O valor da opção selecionada. Usado com v-model. |
| options | Array | `` | Array de objetos para gerar os botões de rádio. Cada objeto deve ter label e value. |
| label | String | '' | Um rótulo para todo o grupo de rádio, importante para acessibilidade. |
| name | String | (gerado) | O atributo name compartilhado por todos os inputs de rádio no grupo. |
| disabled | Boolean | false | Se true, desabilita todos os botões de rádio no grupo. |
| orientation | String | 'vertical' | A orientação do layout do grupo. Aceita: 'vertical', 'horizontal'. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | Permite a inserção manual de componentes BaseRadio individuais em vez de usar a prop options. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:modelValue | String | Number | Emitido quando a seleção muda, para suportar v-model. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Radio Group.17

*   O elemento container do grupo deve ter role="radiogroup".
*   O grupo deve ter um rótulo acessível via aria-labelledby, referenciando o elemento que contém a prop label.
*   Cada opção de rádio deve ter role="radio".
*   A navegação entre as opções com as teclas de seta (cima/baixo, esquerda/direita) é mandatória e deve atualizar a seleção.

**Exemplo de Uso:**

HTML

<BaseRadioGroup  
v-model="form.priority"  
label="Prioridade"  
:options=""  
orientation="horizontal"  
/>  

#### Componente: BaseButton.vue

**Descrição:** Um componente de botão para acionar ações. Oferece múltiplas variantes visuais e estados, mantendo a consistência em toda a aplicação.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| variant | String | 'secondary' | Define o estilo visual e semântico. Aceita: 'primary', 'secondary', 'danger', 'text', 'link'. |
| size | String | 'medium' | Define o tamanho do botão. Aceita: 'small', 'medium', 'large'. |
| shape | String | 'default' | Define a forma do botão. Aceita: 'default' (retangular), 'round' (bordas arredondadas), 'circle' (para botões de ícone). |
| disabled | Boolean | false | Se true, desabilita o botão. |
| loading | Boolean | false | Se true, exibe um ícone de carregamento e desabilita o botão. |
| htmlType | String | 'button' | O atributo type do elemento <button> nativo. Aceita: 'button', 'submit', 'reset'. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O conteúdo principal do botão, geralmente o texto do rótulo. |
| icon | Um slot opcional para adicionar um ícone ao lado do texto. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| click | MouseEvent | Emitido quando o botão é clicado. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Button.27

*   Deve renderizar um elemento <button> nativo.
*   Quando disabled for true, o atributo disabled nativo e aria-disabled="true" devem ser aplicados.
*   Se for um botão de ícone sem texto, um aria-label deve ser fornecido programaticamente para descrever a ação.
*   Para botões de alternância (toggle), o atributo aria-pressed deve ser gerenciado.

**Exemplo de Uso:**

HTML

<BaseButton variant="primary" size="large" @click="saveWorkOrder">  
Salvar Ordem de Serviço  
</BaseButton>  
  
<BaseButton variant="danger" shape="circle" :loading="isDeleting" aria-label="Excluir item">  
<template #icon>  
<IconTrash />  
</template>  
</BaseButton>  

#### Componente: BaseFileUpload.vue

**Descrição:** Um componente para lidar com a seleção de arquivos pelo usuário, seja por clique ou arrastando e soltando. Este componente gerencia a lista de arquivos selecionados, mas não realiza o upload.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| fileList | Array | `` | Uma lista de objetos de arquivo para exibição (controlado). |
| accept | String | '' | String que define os tipos de arquivo que o controle pode aceitar (ex: 'image/png, image/jpeg'). |
| multiple | Boolean | false | Se true, permite a seleção de múltiplos arquivos. |
| disabled | Boolean | false | Se true, desabilita a funcionalidade de upload. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O conteúdo que serve como gatilho para a seleção de arquivos (ex: um botão ou uma área de dropzone). |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:fileList | Array | Emitido quando a lista de arquivos é alterada (arquivos adicionados ou removidos). |

**Acessibilidade:**

*   O componente deve conter um <input type="file"> oculto.
*   O elemento no slot default deve acionar o clique no input de arquivo.
*   Se o gatilho for um botão, ele deve ser um <button> real.
*   A área de dropzone deve fornecer feedback visual e textual claro.

**Exemplo de Uso:**

HTML

<BaseFileUpload v-model:fileList="attachments" multiple accept="application/pdf">  
<div class="dropzone">  
<p>Arraste e solte os arquivos aqui, ou clique para selecionar.</p>  
</div>  
</BaseFileUpload>  

### 2.2 Categoria: Feedback e Exibição

#### Componente: BaseBadge.vue

**Descrição:** Um pequeno contador ou ponto, geralmente posicionado no canto de outro elemento, para notificar o usuário sobre algo (ex: número de mensagens não lidas).

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| count | Number | 0 | O número a ser exibido no badge. |
| showZero | Boolean | false | Se true, exibe o badge mesmo quando count é 0. |
| dot | Boolean | false | Se true, exibe um pequeno ponto em vez de um número. |
| overflowCount | Number | 99 | O número máximo a ser exibido. Acima disso, mostrará overflowCount+. |
| status | String | undefined | Transforma o badge em um ponto de status. Aceita: 'success', 'processing', 'default', 'error', 'warning'. |
| color | String | undefined | Define uma cor customizada para o badge (usando um token de cor CSS). |
| offset | Array | `` | Deslocamento do badge em [x, y] pixels em relação à sua posição padrão. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O elemento ao qual o badge será anexado. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   O conteúdo do badge (o número ou status) deve ser acessível para leitores de tela. Se o badge estiver descrevendo o estado de um controle (ex: "3 notificações não lidas"), o controle deve ter um nome acessível que inclua essa informação, possivelmente via aria-describedby.

**Exemplo de Uso:**

HTML

<BaseBadge :count="unreadMessages" :overflow-count="9">  
<BaseAvatar shape="square" />  
</BaseBadge>  
  
<BaseBadge status="success" /> Disponível  

#### Componente: BaseAlert.vue

**Descrição:** Um componente para exibir mensagens de feedback importantes e contextuais para o usuário, como sucesso, erro, aviso ou informação.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| variant | String | 'info' | Define o estilo visual e semântico. Aceita: 'info', 'success', 'warning', 'danger'. |
| title | String | '' | Título opcional em negrito exibido acima da mensagem. |
| dismissible | Boolean | false | Se true, exibe um botão 'X' para fechar o alerta. |
| showIcon | Boolean | false | Se true, exibe um ícone padrão correspondente à variante. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O conteúdo principal (texto) do alerta. |
| icon | Um slot opcional para substituir o ícone padrão por um customizado. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| dismiss | void | Emitido quando o usuário clica no botão de fechar (se dismissible for true). |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Alert.28

*   O elemento raiz deve ter role="alert". Isso fará com que os leitores de tela anunciem o conteúdo do alerta assim que ele aparecer, sem mover o foco.
*   O botão de fechar deve ser um <button> com um aria-label claro, como "Fechar alerta".

**Exemplo de Uso:**

HTML

<BaseAlert variant="success" title="Sucesso!" dismissible @dismiss="handleClose">  
Sua Ordem de Serviço foi criada com sucesso.  
</BaseAlert>  

#### Componente: BaseSpinner.vue

**Descrição:** Um indicador animado usado para informar ao usuário que uma operação está em andamento.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| size | String | 'medium' | Define o tamanho do spinner. Aceita: 'small', 'medium', 'large'. |
| label | String | 'Carregando...' | Texto acessível para leitores de tela. Não é visível. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| (nenhum) | Este componente não possui slots. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   O elemento raiz deve ter role="status" para indicar que é uma região viva que informa o status de uma tarefa.
*   Deve conter um elemento visualmente oculto com o texto da prop label para que os leitores de tela possam anunciar o propósito do spinner.

**Exemplo de Uso:**

HTML

<div v-if="isLoading">  
<BaseSpinner size="large" label="Carregando dados da ordem de serviço..." />  
</div>  

#### Componente: BaseTooltip.vue

**Descrição:** Um pequeno pop-up que exibe informações quando o usuário passa o mouse ou foca em um elemento.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| content | String | '' | O texto a ser exibido dentro do tooltip. |
| placement | String | 'top' | A posição do tooltip em relação ao elemento gatilho. Aceita: 'top', 'bottom', 'left', 'right'. |
| trigger | String | 'hover' | A ação que aciona o tooltip. Aceita: 'hover', 'focus', 'click'. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O elemento que, ao ser interagido, acionará o tooltip. |
| content | Permite injetar conteúdo HTML complexo no tooltip, em vez de usar a prop content. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Tooltip.30

*   O elemento tooltip deve ter role="tooltip" e ser oculto por padrão.
*   O elemento gatilho deve ter aria-describedby apontando para o ID do elemento tooltip.
*   O tooltip não deve ser focável. A interação por teclado ocorre focando o elemento gatilho.

**Exemplo de Uso:**

HTML

<BaseTooltip content="Excluir Ordem de Serviço">  
<BaseButton variant="danger" shape="circle" aria-label="Excluir">  
<template #icon><IconTrash /></template>  
</BaseButton>  
</BaseTooltip>  

#### Componente: BaseAvatar.vue

**Descrição:** Usado para representar um usuário ou objeto, suportando imagens, ícones ou iniciais de texto.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| src | String | '' | O URL da imagem a ser exibida. |
| alt | String | '' | Texto alternativo para a imagem, essencial para acessibilidade. |
| shape | String | 'circle' | A forma do avatar. Aceita: 'circle', 'square'. |
| size | String | 'medium' | O tamanho do avatar. Aceita: 'small', 'medium', 'large'. |
| name | String | '' | Nome do usuário. Usado para gerar iniciais como fallback se src falhar ou não for fornecido. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | Permite customizar o conteúdo de fallback (ex: iniciais). |
| icon | Permite fornecer um ícone como conteúdo do avatar. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   Se src for fornecido, o elemento <img> deve ter um alt text significativo. Se o avatar for puramente decorativo, alt="". Se representar um usuário, alt deve ser o nome do usuário.
*   Se for um avatar de texto (iniciais), o conteúdo textual deve ser envolvido por um aria-label no elemento raiz com o nome completo para fornecer contexto.

**Exemplo de Uso:**

HTML

<BaseAvatar src="/path/to/user.jpg" alt="Foto de João Silva" size="large" />  
  
<BaseAvatar name="Carlos Pereira" size="small" />  

#### Componente: BaseProgress.vue

**Descrição:** Exibe o progresso de uma operação, seja em formato de linha ou círculo.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| percent | Number | 0 | A porcentagem de conclusão (0 a 100). |
| type | String | 'line' | O tipo de barra de progresso. Aceita: 'line', 'circle'. |
| status | String | 'normal' | O estado da barra de progresso. Aceita: 'normal', 'success', 'exception'. |
| showInfo | Boolean | true | Se true, exibe o texto com a porcentagem. |
| strokeColor | String | undefined | Cor customizada para a barra de progresso (usar um token CSS). |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | Permite customizar o texto exibido dentro ou ao lado da barra de progresso. Recebe { percent } no escopo. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Progressbar.32

*   O elemento raiz deve ter role="progressbar".
*   Deve ter os atributos aria-valuenow (valor atual), aria-valuemin="0" e aria-valuemax="100".
*   Deve ter um rótulo acessível via aria-label ou aria-labelledby.

**Exemplo de Uso:**

HTML

<BaseProgress :percent="75" />  
  
<BaseProgress type="circle" :percent="50" status="exception" />  

### 2.3 Categoria: Layout e Estrutura

#### Componente: BaseCard.vue

**Descrição:** Um container de conteúdo flexível com seções opcionais para cabeçalho, rodapé e ações. Usado para agrupar informações relacionadas em um bloco visualmente distinto.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| title | String | '' | O título exibido no cabeçalho do card. |
| bordered | Boolean | true | Se true, exibe uma borda ao redor do card. |
| hoverable | Boolean | false | Se true, aplica um efeito de elevação ao passar o mouse. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O conteúdo principal (corpo) do card. |
| cover | Uma área para exibir uma imagem ou mídia na parte superior do card. |
| extra | Conteúdo a ser exibido no canto superior direito do cabeçalho (ex: um botão ou link). |
| actions | Uma área no rodapé do card para exibir uma lista de ações. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   O card em si é um container de layout, geralmente com role="region" se tiver um título (aria-labelledby apontando para o título) para criar um marco de navegação.
*   Todos os elementos interativos dentro do card (nos slots extra ou actions) devem seguir suas próprias diretrizes de acessibilidade.

**Exemplo de Uso:**

HTML

<BaseCard title="Ordem de Serviço #12345" hoverable>  
<template #extra><a href="#">Detalhes</a></template>  
  
<p>Status: Em Andamento</p>  
<p>Técnico: João Silva</p>  
  
<template #actions>  
<BaseButton variant="text">Editar</BaseButton>  
<BaseButton variant="text">Concluir</BaseButton>  
</template>  
</BaseCard>  

#### Componente: BaseModal.vue

**Descrição:** Uma janela de diálogo que aparece sobre o conteúdo da página, desabilitando a interação com o restante da interface até que seja dispensada.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| open | Boolean | false | Controla a visibilidade do modal. Use com v-model:open. |
| title | String | '' | O título exibido no cabeçalho do modal. |
| closable | Boolean | true | Se true, exibe um botão 'X' para fechar o modal. |
| maskClosable | Boolean | true | Se true, permite fechar o modal clicando na máscara de fundo. |
| footer | null | (padrão) | Se null, o rodapé padrão com botões OK/Cancelar não será renderizado. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O conteúdo principal (corpo) do modal. |
| header | Permite customizar completamente o cabeçalho, substituindo a prop title. |
| footer | Permite customizar completamente o rodapé, substituindo os botões padrão. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:open | Boolean | Emitido para atualizar o estado de visibilidade, suportando v-model:open. |
| ok | void | Emitido quando o botão 'OK' padrão é clicado. |
| cancel | void | Emitido quando o modal é fechado (via botão 'Cancelar', 'X', tecla Esc ou clique na máscara). |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Dialog (Modal).19

*   O elemento raiz do modal deve ter role="dialog" e aria-modal="true".
*   O modal deve ter um nome acessível via aria-labelledby, referenciando o ID do elemento do título.
*   O foco do teclado DEVE ser aprisionado dentro do modal enquanto ele estiver aberto.
*   A tecla Escape DEVE fechar o modal.
*   Ao fechar, o foco DEVE retornar ao elemento que abriu o modal.

**Exemplo de Uso:**

HTML

<BaseButton @click="isModalOpen = true">Abrir Modal</BaseButton>  
  
<BaseModal v-model:open="isModalOpen" title="Confirmar Ação" @ok="confirmAction">  
<p>Você tem certeza que deseja excluir este item?</p>  
  
<template #footer>  
<BaseButton @click="isModalOpen = false">Cancelar</BaseButton>  
<BaseButton variant="danger" @click="confirmAction">Sim, Excluir</BaseButton>  
</template>  
</BaseModal>  

#### Componente: BaseAccordion.vue

**Descrição:** Um componente que organiza o conteúdo em painéis expansíveis/recolhíveis verticalmente. Pode operar em modo padrão (múltiplos painéis abertos) ou modo acordeão (apenas um painel aberto por vez).

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| accordion | Boolean | false | Se true, apenas um painel pode ser expandido por vez. |
| defaultActiveKey | String, Array | `` | A(s) chave(s) do(s) painel(s) que devem estar abertos inicialmente. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | Onde os componentes BaseAccordionItem devem ser inseridos. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| change | String | Array | Emitido quando o painel ativo muda. O payload é a chave (ou array de chaves) do(s) painel(s) aberto(s). |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Accordion.35

*   Cada cabeçalho de item deve ser um <button> dentro de um elemento de título (<h3>, <h4>, etc.).
*   O botão do cabeçalho deve ter aria-expanded (dinâmico) e aria-controls apontando para o ID do painel de conteúdo.
*   O painel de conteúdo deve ter role="region" e aria-labelledby apontando para o ID do botão do cabeçalho.
*   A navegação por teclado entre os cabeçalhos com as setas Cima/Baixo é recomendada.

**Exemplo de Uso:**

HTML

<BaseAccordion accordion>  
<BaseAccordionItem key="1" title="Passo 1: Inspeção Inicial">  
<p>Conteúdo da inspeção inicial...</p>  
</BaseAccordionItem>  
<BaseAccordionItem key="2" title="Passo 2: Manutenção Preventiva">  
<p>Conteúdo da manutenção preventiva...</p>  
</BaseAccordionItem>  
</BaseAccordion>  

_(Nota: A especificação para BaseAccordionItem seria análoga, com props key e title e um slot default para o conteúdo.)_

#### Componente: BaseDivider.vue

**Descrição:** Uma linha horizontal ou vertical usada para separar conteúdo visualmente.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| type | String | 'horizontal' | A direção do divisor. Aceita: 'horizontal', 'vertical'. |
| orientation | String | 'center' | A posição do texto dentro do divisor horizontal. Aceita: 'left', 'center', 'right'. |
| dashed | Boolean | false | Se true, a linha do divisor será tracejada. |
| plain | Boolean | true | Se true, o texto do divisor não terá estilo de título. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| default | O texto a ser exibido no meio do divisor horizontal. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   O elemento raiz deve ter role="separator" para comunicar sua função a tecnologias assistivas.37 Se for puramente decorativo, role="presentation" pode ser usado.

**Exemplo de Uso:**

HTML

<p>Conteúdo acima</p>  
<BaseDivider>OU</BaseDivider>  
<p>Conteúdo abaixo</p>  
  
<span>Opção 1</span>  
<BaseDivider type="vertical" />  
<span>Opção 2</span>  

### 2.4 Categoria: Navegação

#### Componente: BaseTabs.vue

**Descrição:** Um componente que permite a navegação entre diferentes seções de conteúdo (painéis) em um mesmo espaço de tela.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| activeKey | String | (primeiro item) | A chave do painel de aba atualmente ativo. Use com v-model:activeKey. |
| items | Array | `` | Array de objetos para definir as abas. Cada objeto deve ter key, label e content (ou usar slots). |
| tabPosition | String | 'top' | A posição das abas. Aceita: 'top', 'bottom', 'left', 'right'. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| tab-{key} | Slot nomeado dinamicamente para customizar o rótulo de uma aba específica. |
| panel-{key} | Slot nomeado dinamicamente para o conteúdo de um painel de aba específico. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:activeKey | String | Emitido quando a aba ativa muda, para suportar v-model:activeKey. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Tabs.18

*   O container das abas deve ter role="tablist".
*   Cada aba (botão) deve ter role="tab", aria-selected (dinâmico) e aria-controls apontando para o ID do seu painel.
*   Cada painel de conteúdo deve ter role="tabpanel" e aria-labelledby apontando para o ID da sua aba.
*   A navegação entre as abas com as teclas de seta Esquerda/Direita é mandatória.

**Exemplo de Uso:**

HTML

<BaseTabs  
v-model:activeKey="currentTab"  
:items=""  
\>  
<template #panel-details>  
<p>Conteúdo do painel de detalhes...</p>  
</template>  
<template #panel-history>  
<p>Conteúdo do painel de histórico...</p>  
</template>  
</BaseTabs>  

#### Componente: BaseBreadcrumbs.vue

**Descrição:** Exibe a localização atual do usuário dentro da hierarquia de navegação do site, permitindo o retorno a níveis superiores.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| items | Array | `` | Array de objetos para os links do breadcrumb. Cada objeto deve ter title (String) e opcionalmente href (String). |
| separator | String | '/' | O caractere ou string a ser usado como separador entre os itens. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| separator | Permite substituir o separador padrão por um ícone ou outro elemento. |
| item | Slot com escopo para customizar a renderização de cada item. Recebe { item, index }. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   O componente deve ser envolvido por um elemento <nav> com aria-label="breadcrumb".39
*   A estrutura interna deve ser uma lista ordenada (<ol>).
*   Cada item deve ser um <li>.
*   O item da página atual não deve ser um link e deve ter o atributo aria-current="page".39

**Exemplo de Uso:**

HTML

<BaseBreadcrumbs  
:items=""  
/>  

#### Componente: BasePagination.vue

**Descrição:** Um conjunto de controles para navegar entre páginas de uma lista de itens.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| current | Number | 1 | A página atual. Use com v-model:current. |
| total | Number | 0 | O número total de itens. |
| pageSize | Number | 10 | O número de itens por página. |
| showQuickJumper | Boolean | false | Se true, exibe um campo para pular diretamente para uma página. |
| showSizeChanger | Boolean | false | Se true, exibe um seletor para alterar o pageSize. |
| disabled | Boolean | false | Se true, desabilita todos os controles de paginação. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| (nenhum) | Este componente não possui slots customizáveis. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| update:current | Number | Emitido quando a página atual muda, para suportar v-model:current. |
| change | { page: Number, pageSize: Number } | Emitido quando a página ou o tamanho da página muda. |

**Acessibilidade:**

*   O componente deve ser envolvido por um elemento <nav> com aria-label="pagination".
*   O botão da página atual deve ter aria-current="page".
*   Os botões "anterior" e "próximo" devem ter rótulos acessíveis claros (ex: aria-label="Ir para a página anterior").

**Exemplo de Uso:**

HTML

<BasePagination  
v-model:current="currentPage"  
:total="500"  
:page-size="20"  
show-quick-jumper  
/>  

### 2.5 Categoria: Exibição de Dados

#### Componente: BaseTable.vue

**Descrição:** Um componente para exibir dados estruturados em linhas e colunas. É altamente customizável através de slots para se manter agnóstico ao domínio.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| items | Array | `` | O array de objetos de dados a serem exibidos na tabela. |
| columns | Array | `` | Array de objetos de configuração para as colunas. Cada objeto deve ter key (String, correspondendo à chave no objeto de item) e title (String). Pode incluir sortable (Boolean). |
| rowKey | String | 'id' | A chave única em cada objeto de item para ser usada como a key do Vue. |
| loading | Boolean | false | Se true, exibe um estado de carregamento sobre a tabela. |
| pagination | Object, Boolean | false | Objeto de configuração para o BasePagination ou false para desabilitar. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| headerCell-{key} | Slot com escopo para customizar a renderização do cabeçalho de uma coluna específica. Recebe { column }. |
| cell-{key} | Slot com escopo para customizar a renderização de uma célula para uma coluna específica. Recebe { item, value, index }. Essencial para a customização. |
| empty | Conteúdo a ser exibido quando a tabela não tiver dados (items está vazio). |
| footer | Conteúdo a ser exibido no rodapé da tabela. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| sort | { key: String, order: 'ascend' | 'descend' } | Emitido quando o usuário clica em um cabeçalho de coluna classificável. |

Acessibilidade:

Este componente DEVE seguir o padrão WAI-ARIA Grid se contiver elementos interativos, ou o padrão Table para dados estáticos.40

*   Deve renderizar uma estrutura <table>, <thead>, <tbody>, <tr>, <th>, <td>.
*   Os cabeçalhos de coluna (<th>) devem ter o atributo scope="col".
*   Se a primeira coluna for um cabeçalho de linha, ela deve ter scope="row".
*   Para colunas classificáveis, o <th> deve ter o atributo aria-sort ('ascending', 'descending', ou 'none').

**Exemplo de Uso:**

HTML

<BaseTable  
:items="workOrders"  
:columns=""  
row-key="id"  
:loading="isLoading"  
\>  
<template #cell-status="{ value }">  
<BaseBadge :status="getStatusVariant(value)" /> {{ value }}  
</template>  
  
<template #cell-actions="{ item }">  
<BaseButton size="small">Editar</BaseButton>  
</template>  
</BaseTable>  

#### Componente: BaseList.vue

**Descrição:** Um componente versátil para exibir uma lista de itens. Mais flexível que uma tabela, ideal para conteúdo que não se encaixa em uma grade rígida.

**Props:**

| Nome da Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| dataSource | Array | `` | O array de dados para a lista. |
| bordered | Boolean | false | Se true, exibe uma borda ao redor da lista e divisores entre os itens. |
| loading | Boolean | false | Se true, exibe um estado de carregamento. |
| size | String | 'medium' | O tamanho da lista, afetando o espaçamento. Aceita: 'small', 'medium', 'large'. |
| itemLayout | String | 'horizontal' | O layout dos itens. Aceita: 'horizontal', 'vertical'. |

**Slots:**

| Nome do Slot | Descrição |
| --- | --- |
| header | Conteúdo a ser exibido no topo da lista. |
| footer | Conteúdo a ser exibido na parte inferior da lista. |
| renderItem | Slot com escopo para renderizar cada item da lista. Recebe { item, index }. Este é o slot principal para customização. |
| empty | Conteúdo a ser exibido quando a lista está vazia. |

**Emits:**

| Nome do Evento | Payload | Descrição |
| --- | --- | --- |
| (nenhum) | void | Este componente não emite eventos. |

**Acessibilidade:**

*   A lista deve ser renderizada como um <ul> ou <ol>, com cada item sendo um <li>. Isso fornece a semântica de lista correta para tecnologias assistivas.
*   Se a lista for interativa, cada item deve ser focável e seguir as práticas de navegação por teclado apropriadas.

**Exemplo de Uso:**

HTML

<BaseList  
:data-source="comments"  
item-layout="horizontal"  
:loading="isLoadingComments"  
\>  
<template #renderItem="{ item }">  
<div class="comment">  
<BaseAvatar :name="item.author" />  
<div class="comment-content">  
<strong>{{ item.author }}</strong>  
<p>{{ item.text }}</p>  
</div>  
</div>  
</template>  
</BaseList>  

#### Referências citadas

1.  Building a Modern Component Library: My Journey Beyond the Basics | by Alon Valadji, acessado em outubro 23, 2025, [https://www.designsystemscollective.com/building-a-modern-component-library-my-journey-beyond-the-basics-ab7d0cc0ff38](https://www.designsystemscollective.com/building-a-modern-component-library-my-journey-beyond-the-basics-ab7d0cc0ff38)
2.  Guide to app architecture - Android Developers, acessado em outubro 23, 2025, [https://developer.android.com/topic/architecture](https://developer.android.com/topic/architecture)
3.  The Three-Layer UI Component Architecture: Versatile Building Blocks for Crafting Multiple Design Systems - Markus Oberlehner, acessado em outubro 23, 2025, [https://markus.oberlehner.net/blog/the-three-layer-ui-component-architecture-versatile-building-blocks-for-crafting-multiple-design-systems](https://markus.oberlehner.net/blog/the-three-layer-ui-component-architecture-versatile-building-blocks-for-crafting-multiple-design-systems)
4.  The Ultimate Guide to React Component Libraries | by Wicar Akhtar - Medium, acessado em outubro 23, 2025, [https://medium.com/@wicar/the-ultimate-guide-to-react-component-libraries-02fe60e20f17](https://medium.com/@wicar/the-ultimate-guide-to-react-component-libraries-02fe60e20f17)
5.  Writing good component API - sid.st, acessado em outubro 23, 2025, [https://www.sid.st/component-api/](https://www.sid.st/component-api/)
6.  Components and Props - React, acessado em outubro 23, 2025, [https://legacy.reactjs.org/docs/components-and-props.html](https://legacy.reactjs.org/docs/components-and-props.html)
7.  Principles of Component API (Prop) Design | by Chris Schmitz | HackerNoon.com | Medium, acessado em outubro 23, 2025, [https://medium.com/hackernoon/principles-of-component-api-prop-design-bb20cd58da54](https://medium.com/hackernoon/principles-of-component-api-prop-design-bb20cd58da54)
8.  Vue 3 Slots Explained: Enhancing Component Flexibility - Coding Explorations, acessado em outubro 23, 2025, [https://www.codingexplorations.com/blog/vue-3-slots-explained-enhancing-component-flexibility](https://www.codingexplorations.com/blog/vue-3-slots-explained-enhancing-component-flexibility)
9.  Slots - Vue.js, acessado em outubro 23, 2025, [https://vuejs.org/guide/components/slots](https://vuejs.org/guide/components/slots)
10.  Mastering Vue.js Slots: A Professional Guide to Flexibility | by Ossamakharbaq | Medium, acessado em outubro 23, 2025, [https://medium.com/@ossamakharbaq4/mastering-vue-js-slots-a-professional-guide-to-flexibility-challenges-and-solutions-f549757c98f7](https://medium.com/@ossamakharbaq4/mastering-vue-js-slots-a-professional-guide-to-flexibility-challenges-and-solutions-f549757c98f7)
11.  BEM Methodology: A Step-by-Step Guide for Beginners - Valorem Reply, acessado em outubro 23, 2025, [https://www.valoremreply.com/resources/insights/guide/bem-methodology-a-step-by-step-guide-for-beginners/](https://www.valoremreply.com/resources/insights/guide/bem-methodology-a-step-by-step-guide-for-beginners/)
12.  BEM — Block Element Modifier, acessado em outubro 23, 2025, [https://getbem.com/](https://getbem.com/)
13.  BEM CSS in React - Level Up Coding, acessado em outubro 23, 2025, [https://levelup.gitconnected.com/bem-css-in-react-e0d4a4721872](https://levelup.gitconnected.com/bem-css-in-react-e0d4a4721872)
14.  Patterns - The A11Y Project, acessado em outubro 23, 2025, [https://www.a11yproject.com/patterns/](https://www.a11yproject.com/patterns/)
15.  Authoring Practices Guide (APG) Examples & Rules in 2025 - Elementor, acessado em outubro 23, 2025, [https://elementor.com/blog/apg/](https://elementor.com/blog/apg/)
16.  Accessibility information for web authors - MDN - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Information\_for\_Web\_authors](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Information_for_Web_authors)
17.  Radio Group Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/radio/](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
18.  Tabs Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/tabs/](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
19.  Dialog (Modal) Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
20.  ARIA: textbox role - MDN Web Docs - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/textbox\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/textbox_role)
21.  WAI-ARIA: Role=Textbox - DigitalA11Y, acessado em outubro 23, 2025, [https://www.digitala11y.com/textbox-role/](https://www.digitala11y.com/textbox-role/)
22.  ARIA: combobox role - MDN Web Docs - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role)
23.  Combobox Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/combobox/](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
24.  WAI-ARIA: Role=Checkbox - DigitalA11Y, acessado em outubro 23, 2025, [https://www.digitala11y.com/checkbox-role/](https://www.digitala11y.com/checkbox-role/)
25.  Checkbox Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
26.  ARIA: radiogroup role - MDN Web Docs - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/radiogroup\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/radiogroup_role)
27.  Button Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/button/](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
28.  Notification - Carbon Design System, acessado em outubro 23, 2025, [https://v10.carbondesignsystem.com/components/notification/accessibility/](https://v10.carbondesignsystem.com/components/notification/accessibility/)
29.  WAI-ARIA 1.2 Cheat Sheet - DigitalA11Y, acessado em outubro 23, 2025, [https://www.digitala11y.com/wai-aria-1-1-cheat-sheet/](https://www.digitala11y.com/wai-aria-1-1-cheat-sheet/)
30.  ARIA: tooltip role - MDN Web Docs - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tooltip\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tooltip_role)
31.  Basic Tooltip Implementation, acessado em outubro 23, 2025, [https://butterpep.com/basic-tooltip.html](https://butterpep.com/basic-tooltip.html)
32.  WAI-ARIA: ROLE=PROGRESSBAR - DigitalA11Y, acessado em outubro 23, 2025, [https://www.digitala11y.com/progressbar-role/](https://www.digitala11y.com/progressbar-role/)
33.  ARIA: progressbar role - MDN Web Docs, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/progressbar\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/progressbar_role)
34.  ARIA: dialog role - MDN Web Docs - Mozilla, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role)
35.  Accordion Pattern (Sections With Show/Hide Functionality) | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/accordion/](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
36.  Accessible Accordion - examples and best practices - aditus.io, acessado em outubro 23, 2025, [https://www.aditus.io/patterns/accordion/](https://www.aditus.io/patterns/accordion/)
37.  Divider - Ant Design, acessado em outubro 23, 2025, [https://ant.design/components/divider/](https://ant.design/components/divider/)
38.  ARIA: tab role - MDN Web Docs, acessado em outubro 23, 2025, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab\_role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role)
39.  Bootstrap Breadcrumb - extended examples and tutorials - CoreUI, acessado em outubro 23, 2025, [https://coreui.io/bootstrap/docs/components/breadcrumb/](https://coreui.io/bootstrap/docs/components/breadcrumb/)
40.  Table Pattern | APG | WAI - W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/table/](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
41.  Grid (Interactive Tabular Data and Layout Containers) Pattern | APG | WAI | W3C, acessado em outubro 23, 2025, [https://www.w3.org/WAI/ARIA/apg/patterns/grid/](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)