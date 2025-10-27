# Dicionário de Dados do Banco de Dados CMMS

Este documento serve como a fonte de verdade para a descrição e o propósito de cada tabela e coluna no banco de dados do sistema CMMS.

---

### **Tabela: `public.users`**
Armazena as contas de todos os indivíduos que interagem com o sistema, desde solicitantes a administradores.

* **id** (`uuid`): Identificador único universal (UUID) para o usuário.
* **email** (`text`): Endereço de e-mail único do usuário, usado para login e notificações.
* **full_name** (`text`): Nome completo do usuário para fácil identificação na interface.
* **role** (`text`): Define o nível de permissão do usuário no sistema (admin, manager, technician, requester).
* **created_at** (`timestamp with time zone`): Timestamp de quando o registro do usuário foi criado no sistema.
* **updated_at** (`timestamp with time zone`): Timestamp da última atualização do registro do usuário.

---

### **Tabela: `public.maps`**
Armazena os mapas visuais (ex: plantas da fábrica) nos quais as localizações podem ser fixadas.

* **id** (`uuid`): Identificador único universal (UUID) para o mapa.
* **name** (`text`): Nome descritivo e único do mapa (ex: "Planta Baixa - 1º Andar").
* **image_path** (`text`): O caminho no armazenamento para o arquivo de imagem do mapa (ex: um PNG da planta).
* **created_at** (`timestamp with time zone`): Timestamp de quando o registro do mapa foi criado.
* **updated_at** (`timestamp with time zone`): Timestamp da última atualização do registro do mapa.

---

### **Tabela: `public.locations`**
Registra os locais físicos onde os ativos estão instalados (ex: "Prédio A, Sala 101", "Ala Norte").

* **id** (`uuid`): Identificador único universal (UUID) para a localização.
* **name** (`text`): Nome descritivo e único da localização.
* **description** (`text`): Descrição adicional sobre a localização, se necessário.
* **map_id** (`uuid`): Chave estrangeira que referencia o mapa (`public.maps`) no qual esta localização está posicionada.
* **x_coordinate** (`integer`): A coordenada no eixo X do ponto da localização na imagem do mapa referenciado.
* **y_coordinate** (`integer`): A coordenada no eixo Y do ponto da localização na imagem do mapa referenciado.
* **created_at** (`timestamp with time zone`): Timestamp de quando o registro da localização foi criado.

---

### **Tabela: `public.assets`**
Armazena os equipamentos físicos e outros ativos que requerem manutenção e gerenciamento.

* **id** (`uuid`): Identificador único universal (UUID) para o ativo.
* **name** (`text`): Nome descritivo e legível do ativo (ex: "Ar Condicionado Central", "Bomba Hidráulica B-52").
* **asset_tag** (`text`): Código de identificação único (etiqueta), como um código de barras ou QR code, fisicamente afixado ao ativo para fácil rastreamento.
* **location_id** (`uuid`): Chave estrangeira que referencia a localização física do ativo na tabela "locations".
* **criticality** (`integer`): Nível de criticidade do ativo para a operação (ex: 1 a 5), onde 5 é o mais crítico.
* **created_at** (`timestamp with time zone`): Timestamp de quando o registro do ativo foi criado no sistema.
* **updated_at** (`timestamp with time zone`): Timestamp da última atualização do registro do ativo.

---

### **Tabela: `public.tickets`**
Sistema de ticketing para que usuários possam solicitar reparos ou reportar problemas, que podem ou não se tornar ordens de serviço.

* **id** (`uuid`): Identificador único universal (UUID) para o ticket.
* **title** (`text`): Título curto e objetivo do ticket.
* **description** (`text`): Descrição detalhada da solicitação ou problema reportado pelo usuário.
* **requester_id** (`uuid`): Chave estrangeira que identifica o usuário que abriu o ticket.
* **assigned_to_id** (`uuid`): Chave estrangeira opcional que aponta para o técnico ou gerente responsável por avaliar o ticket.
* **status** (`text`): Estado atual do ticket (new, open, pending, resolved, closed).
* **created_at** (`timestamp with time zone`): Timestamp de quando o ticket foi criado.
* **asset_id** (`uuid`): Chave estrangeira opcional que vincula o ticket diretamente a um ativo.

---

### **Tabela: `public.work_orders`**
Coração do sistema: registra as ordens de serviço para manutenção corretiva ou planejada em ativos.

* **id** (`uuid`): Identificador único universal (UUID) para a ordem de serviço.
* **title** (`text`): Título curto e descritivo da ordem de serviço.
* **description** (`text`): Descrição detalhada do trabalho a ser realizado ou do problema reportado.
* **asset_id** (`uuid`): Chave estrangeira que vincula a ordem de serviço ao ativo específico que necessita de manutenção.
* **assigned_to_id** (`uuid`): Chave estrangeira que aponta para o técnico (usuário) responsável pela execução da ordem.
* **status** (`text`): Estado atual da ordem de serviço no seu ciclo de vida (open, in_progress, completed, etc.).
* **priority** (`integer`): Nível de prioridade da ordem de serviço (ex: 1 a 5), onde 5 é a mais urgente.
* **scheduled_start** (`timestamp with time zone`): Timestamp de quando o trabalho está programado para começar.
* **completed_at** (`timestamp with time zone`): Timestamp de quando o trabalho foi efetivamente concluído.
* **created_at** (`timestamp with time zone`): Timestamp de quando a ordem de serviço foi criada.
* **updated_at** (`timestamp with time zone`): Timestamp da última atualização da ordem de serviço.
* **ticket_id** (`uuid`): Chave estrangeira que vincula a OS ao ticket de origem.
* **maintenance_approver_id** (`uuid`): ID do usuário de manutenção que aprovou a OS.
* **maintenance_approved_at** (`timestamp with time zone`): Timestamp da aprovação de manutenção.
* **production_approver_id** (`uuid`): ID do usuário de produção que aprovou a OS.
* **production_approved_at** (`timestamp with time zone`): Timestamp da aprovação de produção.
* **root_cause** (`text`): Descrição da causa raiz do problema identificado.
* **action_taken** (`text`): Descrição detalhada da ação corretiva executada.
* **actual_start_at** (`timestamp with time zone`): Timestamp real do início do trabalho pelo técnico.
* **next_os_recommendation** (`text`): Notas para orientar a criação de uma futura OS, se necessário.

---

### **Tabela: `public.work_order_photos`**
Armazena referências a fotos associadas a uma ordem de serviço.

* **id** (`uuid`): Identificador único da foto.
* **work_order_id** (`uuid`): Chave estrangeira que vincula à ordem de serviço.
* **photo_path** (`text`): Caminho do arquivo de imagem armazenado no servidor.
* **description** (`text`): Descrição opcional da foto.
* **uploaded_at** (`timestamp with time zone`): Timestamp de quando a foto foi enviada.
* **uploaded_by_id** (`uuid`): Chave estrangeira que identifica o usuário que enviou a foto.

---

### **Tabela: `public.parts`**
Catálogo de peças e materiais de reposição utilizados nas manutenções.

* **id** (`uuid`): Identificador único universal (UUID) para a peça.
* **name** (`text`): Nome descritivo da peça (ex: "Filtro de ar HEPA", "Rolamento 6203").
* **sku** (`text`): Stock Keeping Unit (SKU) ou código de produto único para a peça.
* **quantity_on_hand** (`integer`): Quantidade atual da peça disponível em estoque.
* **reorder_point** (`integer`): Nível mínimo de estoque que, ao ser atingido, deve disparar um processo de reposição.
* **created_at** (`timestamp with time zone`): Timestamp de quando a peça foi registrada no sistema.

---

### **Tabela: `public.inventory_transactions`**
Registra todas as movimentações de entrada e saída de peças do estoque.

* **id** (`uuid`): Identificador único universal (UUID) para a transação.
* **part_id** (`uuid`): Chave estrangeira que referencia a peça movimentada.
* **work_order_id** (`uuid`): Chave estrangeira opcional que vincula a transação a uma ordem de serviço específica (geralmente para saídas).
* **transaction_type** (`text`): Tipo de transação (deduction, addition, adjustment) para controlar a movimentação.
* **quantity_changed** (`integer`): A quantidade de peças que foi adicionada, deduzida ou ajustada.
* **user_id** (`uuid`): Chave estrangeira que identifica o usuário responsável pela transação de inventário.
* **transaction_date** (`timestamp with time zone`): Timestamp de quando a transação ocorreu.

---

### **Tabela: `public.work_order_parts`**
Tabela de associação que detalha quais peças e em que quantidade foram utilizadas em cada ordem de serviço.

* **work_order_id** (`uuid`): Chave estrangeira que referencia a ordem de serviço.
* **part_id** (`uuid`): Chave estrangeira que referencia a peça utilizada.
* **quantity_used** (`integer`): Quantidade exata da peça utilizada na ordem de serviço.

---

### **Tabela: `public.pm_schedules`**
Define os planos de manutenção preventiva para os ativos, baseados em tempo ou em medições de uso.

* **id** (`uuid`): Identificador único universal (UUID) para o agendamento de PM.
* **asset_id** (`uuid`): Chave estrangeira que vincula o plano de manutenção a um ativo específico.
* **task_description** (`text`): Descrição da tarefa de manutenção preventiva a ser realizada.
* **frequency_type** (`text`): Tipo de gatilho para a manutenção (time para baseada em tempo, meter para baseada em uso/medição).
* **frequency_interval** (`integer`): O valor numérico do intervalo (ex: 90 para 90 dias, 500 para 500 horas).
* **frequency_unit** (`text`): A unidade do intervalo (ex: "dias", "semanas", "horas", "ciclos").
* **last_pm_date** (`timestamp with time zone`): Timestamp da última vez que esta manutenção preventiva foi concluída.
* **next_due_date** (`timestamp with time zone`): Timestamp calculado da próxima data de vencimento para a manutenção preventiva.

---

### **Tabela: `public.ticket_comments`**
Armazena o histórico de conversas e atualizações relacionadas a um ticket específico.

* **id** (`uuid`): Identificador único universal (UUID) para o comentário.
* **ticket_id** (`uuid`): Chave estrangeira que vincula o comentário ao seu respectivo ticket.
* **user_id** (`uuid`): Chave estrangeira que identifica o autor do comentário.
* **comment** (`text`): O conteúdo textual do comentário.
* **created_at** (`timestamp with time zone`): Timestamp de quando o comentário foi adicionado.

---

### **Tabela: `public.feedback`**
Coleta avaliações e comentários dos solicitantes após a resolução de um ticket, para medição de satisfação.

* **id** (`uuid`): Identificador único universal (UUID) para o registro de feedback.
* **ticket_id** (`uuid`): Chave estrangeira que vincula o feedback ao ticket resolvido.
* **user_id** (`uuid`): Chave estrangeira que identifica o usuário que forneceu o feedback.
* **rating** (`integer`): Avaliação numérica da satisfação do usuário (ex: de 1 a 5).
* **comments** (`text`): Comentários adicionais deixados pelo usuário.
* **submitted_at** (`timestamp with time zone`): Timestamp de quando o feedback foi enviado.