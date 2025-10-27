# Guia Arquitetural e de Implantação para Sistema CMMS em Python e Windows Server

## 1\. Análise e Recomendação de Framework Python

A seleção do framework de backend é a decisão arquitetural mais impactante para o projeto do sistema CMMS. Esta escolha influenciará diretamente a velocidade de desenvolvimento, a manutenibilidade, a segurança e a facilidade de integração com o esquema de banco de dados PostgreSQL existente. A análise a seguir avalia Django, Flask e FastAPI não como tecnologias abstratas, mas como ferramentas aplicadas especificamente ao desafio de construir uma aplicação de CMMS robusta e data-intensiva.

### 1.1. Avaliação Comparativa: Django, Flask e FastAPI para um Sistema CMMS

Cada um dos principais frameworks Python possui uma filosofia distinta que o torna mais ou menos adequado para este projeto.

*   **Django:** É um framework "batteries-included" (com tudo incluído), de alto nível, projetado para o desenvolvimento rápido de aplicações web complexas e seguras.1 Ele vem com um vasto conjunto de funcionalidades integradas, como um Object-Relational Mapper (ORM), sistema de autenticação e autorização, uma interface administrativa pronta para uso e um motor de templates.1
*   **Flask:** É um "micro-framework" minimalista que fornece o núcleo essencial para o desenvolvimento web (roteamento e tratamento de requisições) e deixa todas as outras decisões, como a escolha de um ORM ou sistema de autenticação, para o desenvolvedor.3 Sua força reside na flexibilidade e no controle granular sobre a stack tecnológica.
*   **FastAPI:** É um framework moderno e de alta performance, construído para criar APIs de forma rápida e eficiente.1 Ele utiliza anotações de tipo do Python para validação de dados e gera documentação interativa automaticamente. Sua arquitetura assíncrona o torna extremamente rápido para operações de I/O intensivas.6

Para uma aplicação de CMMS, cujas necessidades são inferidas a partir do esquema de banco de dados fornecido 8, funcionalidades como gerenciamento de usuários com diferentes papéis (users.role), um sistema de permissões robusto e uma interface para administrar entidades complexas (work\_orders, assets, pm\_schedules) são cruciais. Django oferece essas funcionalidades de forma nativa e coesa. Em contraste, com Flask ou FastAPI, seria necessário montar essa stack a partir de múltiplas bibliotecas de terceiros, como SQLAlchemy para o ORM e Flask-Login ou FastAPI-Users para autenticação.2

A filosofia "batteries-included" do Django, neste contexto, não é meramente uma questão de conveniência, mas sim de prontidão para o ambiente corporativo e de mitigação de riscos de integração. Um CMMS é uma aplicação empresarial crítica. A abordagem de montar a stack com Flask ou FastAPI introduz um "risco de integração", onde o desenvolvedor se torna o responsável por garantir a compatibilidade, segurança e manutenção de pacotes díspares. O ecossistema integrado do Django oferece um conjunto de ferramentas pré-validado, seguro e coeso, permitindo que a equipe de desenvolvimento se concentre na lógica de negócio do CMMS — gerenciar ordens de serviço, ativos e transações de inventário — em vez de se preocupar com a infraestrutura fundamental do software.1

### 1.2. O Fator Crítico: Interagindo com um Banco de Dados Legado

A restrição técnica mais significativa do projeto é a necessidade de interagir com um esquema PostgreSQL pré-existente. A capacidade do framework de mapear eficientemente este esquema para objetos Python é fundamental.

*   **Abordagem do Django:** O Django fornece uma solução nativa e poderosa para este exato problema: o comando inspectdb. Esta ferramenta introspecciona o banco de dados e gera automaticamente as definições dos modelos Python, acelerando drasticamente a configuração inicial.9 Embora a documentação o descreva como um "atalho" que requer refinamento manual 9, ele elimina uma quantidade substancial de trabalho repetitivo.
*   **Abordagem de Flask/FastAPI:** Sendo agnósticos em relação ao ORM, a escolha padrão para estes frameworks é o SQLAlchemy.11 O SQLAlchemy possui uma funcionalidade análoga chamada automap, que também pode refletir o esquema do banco de dados para gerar classes mapeadas.12

A comparação se resume, portanto, aos ORMs. O ORM do Django segue o padrão _Active Record_, está fortemente integrado ao seu ecossistema (admin, forms, serializers) e prioriza a produtividade do desenvolvedor.11 O SQLAlchemy, por outro lado, implementa o padrão _Data Mapper_, oferecendo maior poder e flexibilidade para consultas complexas, mas ao custo de uma curva de aprendizado mais acentuada e de mais código boilerplate.11

Para um banco de dados legado, o ORM opinativo do Django se torna uma vantagem, não uma limitação. Um esquema de banco de dados existente pode conter inconsistências ou não seguir as convenções estritas que um framework preferiria. A flexibilidade do SQLAlchemy permitiria mapear essas inconsistências com precisão, mas isso também significa que o desenvolvedor _deve_ lidar com elas, aumentando a complexidade. O inspectdb do Django, seguido por suas convenções de ORM, força o desenvolvedor a limpar e conformar os modelos gerados ao "jeito Django". Embora isso pareça restritivo, o resultado é uma camada de acesso a dados mais manutenível e previsível a longo prazo. Ele impõe uma estrutura padrão que é inestimável para a colaboração em equipe e o desenvolvimento futuro, efetivamente "refatorando" os padrões de acesso aos dados na camada da aplicação.

### 1.3. Veredito Arquitetural: A Escolha do Django

Com base na análise, a recomendação inequívoca para a construção do sistema CMMS é o **Django**. Esta decisão é fundamentada em três pilares principais:

1.  **Velocidade de Desenvolvimento:** A combinação do inspectdb para a geração inicial dos modelos e do Painel de Administração auto-gerado do Django fornece um backend funcional para gerenciamento de dados com um esforço de codificação mínimo.1 Isso permite que os stakeholders interajam com os dados do sistema (por exemplo, adicionando novos assets ou parts) quase que imediatamente, validando o modelo de dados e acelerando o ciclo de feedback.
2.  **Completude de Funcionalidades para um CMMS:** Um CMMS transcende simples endpoints de API. Ele exige gerenciamento de usuários, permissões baseadas em papéis e uma interface administrativa poderosa. O Django fornece todas essas funcionalidades prontas para uso, alinhando-se perfeitamente com a tabela users do esquema e a necessidade implícita de gerenciar entidades complexas como work\_orders e pm\_schedules.3
3.  **Performance Adequada ao Contexto:** Embora o FastAPI seja comprovadamente mais rápido em benchmarks de requisição/resposta 5, essa métrica é secundária para uma aplicação CRUD centrada em banco de dados como um CMMS. O principal gargalo de performance será, quase certamente, a eficiência das consultas ao banco de dados, e não o overhead do framework web.20 O ORM do Django é altamente otimizado para as consultas típicas de uma aplicação web e fornece ferramentas poderosas (select\_related, prefetch\_related) para mitigar problemas de performance no nível do banco de dados.22 Portanto, a vantagem de velocidade do FastAPI é negligenciável neste contexto, enquanto a vantagem de velocidade de desenvolvimento do Django é monumental.

A tabela a seguir resume a análise comparativa, reforçando a recomendação.

**Tabela 1: Tabela Comparativa de Frameworks para o Projeto CMMS**

| Característica | Django | Flask | FastAPI |
| --- | --- | --- | --- |
| ORM (Integração e Introspecção) | Integrado (ORM Django), com inspectdb para bancos de dados legados. Alta produtividade. | Agnostic. Requer biblioteca externa (ex: SQLAlchemy com automap). Mais flexível, porém mais complexo. | Agnostic. Requer biblioteca externa (ex: SQLAlchemy com automap). Mais flexível, porém mais complexo. |
| Painel de Administração | Incluído e auto-gerado a partir dos modelos. Pronto para produção. | Requer extensão (ex: Flask-Admin). | Requer implementação customizada ou biblioteca de terceiros. |
| Autenticação e Permissões | Sistema robusto e granular incluído. | Requer extensão (ex: Flask-Login). | Requer biblioteca externa e configuração manual. |
| Velocidade de Desenvolvimento (para CRUD) | Muito alta, devido às funcionalidades "batteries-included". | Média. Requer a integração de múltiplos componentes. | Média. Rápido para APIs, mas requer integração de outros componentes para uma aplicação completa. |
| Performance (para CRUD) | Excelente. O gargalo é o banco de dados, não o framework. | Excelente. O gargalo é o banco de dados, não o framework. | Excepcional (ASGI). Vantagem mais notável em I/O-bound, não necessariamente em CRUDs simples. |
| Curva de Aprendizado | Média. A estrutura opinativa requer aprendizado inicial, mas guia o desenvolvimento. | Baixa. Fácil de começar, mas a complexidade cresce com o projeto. | Baixa a Média. Requer entendimento de conceitos assíncronos e anotações de tipo. |
| Ecossistema | Maduro e vasto, com pacotes bem integrados. | Vasto, porém fragmentado. Requer mais esforço de integração. | Em rápido crescimento, focado em ferramentas modernas de API. |
| Recomendação para CMMS | Altamente Recomendado | Viável, mas com maior custo de desenvolvimento e integração. | Ideal para microserviços de alta performance, mas overkill e incompleto para uma aplicação monolítica de CMMS. |

## 2\. Padrões de Arquitetura de Backend com Django

Com a escolha do Django, esta seção fornece um plano detalhado para a construção da aplicação. O foco é estabelecer uma estrutura escalável e manutenível desde o início, indo além do layout padrão do Django para adotar padrões de nível empresarial.

### 2.1. Estrutura de Projeto Escalável para Aplicações Corporativas

Para uma aplicação corporativa como o CMMS, que tende a crescer em complexidade, uma estrutura de projeto bem organizada é fundamental para a manutenibilidade.22 A estrutura recomendada promove a modularidade e uma clara separação de responsabilidades.

*   **Estrutura de Diretórios:**  
    cmms\_project/  
    ├──.env # Arquivo de variáveis de ambiente (ignorado pelo Git)  
    ├── manage.py # Utilitário de gerenciamento do Django  
    └── src/  
    ├── apps/ # Diretório para todas as aplicações de negócio  
    │ ├── assets/  
    │ ├── core/ # App para lógica compartilhada (modelos base, utils)  
    │ ├── ticketing/  
    │ └── work\_orders/  
    ├── config/ # Pacote de configuração do projeto  
    │ ├── \_\_init\_\_.py  
    │ ├── asgi.py  
    │ ├── wsgi.py  
    │ ├── urls.py  
    │ └── settings/  
    │ ├── \_\_init\_\_.py  
    │ ├── base.py # Configurações comuns  
    │ ├── development.py # Configurações de desenvolvimento  
    │ └── production.py # Configurações de produção  
    └── static/ # Arquivos estáticos globais (se necessário)  
      
    Esta estrutura isola o código-fonte em um diretório src/, separa as aplicações de negócio em apps/ e organiza as configurações por ambiente, uma prática recomendada para projetos de grande escala.23
*   **Gerenciamento de Configurações:** A divisão do arquivo settings.py em um pacote (settings/) é uma prática de segurança e organização crucial. O arquivo base.py contém todas as configurações comuns, enquanto development.py e production.py importam de base.py e sobrescrevem/adicionam configurações específicas para cada ambiente. Isso evita que segredos de produção, como chaves de API ou senhas de banco de dados, sejam expostos em ambientes de desenvolvimento.22

### 2.2. Camada de Acesso a Dados: Do Schema SQL aos Modelos Django

Este é o processo passo a passo para integrar o banco de dados PostgreSQL existente ao projeto Django.

1.  **Uso do inspectdb:** Com as credenciais do banco de dados configuradas em settings/, execute o seguinte comando na raiz do projeto para gerar os modelos a partir do schema existente:  
    Bash  
    python manage.py inspectdb > src/apps/work\_orders/models\_generated.py  
      
    Isso irá introspectar o banco de dados e redirecionar a saída para um arquivo.9 Para a tabela work\_orders do schema 8, a saída inicial será semelhante a:  
    Python  
    \# This is an auto-generated Django model module.  
    \# You'll have to do the following manually to clean this up:  
    \# \* Rearrange models' order  
    \# \* Make sure each model has one field with primary\_key=True  
    \# \* Make sure each ForeignKey and OneToOneField has \`on\_delete\` set to the desired behavior  
    \# \* Remove \`managed = False\` lines if you wish to allow Django to create, modify, and delete the table  
    \# Feel free to rename the models, but don't rename db\_table values or field names.  
    from django.db import models  
      
    class WorkOrders(models.Model):  
    id = models.UUIDField(primary\_key=True)  
    title = models.TextField()  
    description = models.TextField(blank=True, null=True)  
    asset = models.ForeignKey('Assets', models.DO\_NOTHING)  
    assigned\_to = models.ForeignKey('Users', models.DO\_NOTHING, blank=True, null=True)  
    status = models.TextField()  
    priority = models.IntegerField()  
    scheduled\_start = models.DateTimeField(blank=True, null=True)  
    completed\_at = models.DateTimeField(blank=True, null=True)  
    created\_at = models.DateTimeField()  
    updated\_at = models.DateTimeField()  
      
    class Meta:  
    managed = False  
    db\_table = 'work\_orders'  
    
2.  **A Opção managed = False:** Esta linha na classe Meta do modelo é fundamental. Ela informa ao Django que ele não deve gerenciar o ciclo de vida da tabela no banco de dados (operações CREATE, ALTER, DELETE).9 Isso é essencial para trabalhar com um banco de dados pré-existente, pois impede que o sistema de migrações do Django tente recriar ou alterar tabelas que já existem e são gerenciadas externamente.
3.  **Refinamento dos Modelos:** O resultado do inspectdb é um ponto de partida. É responsabilidade do desenvolvedor refinar esses modelos. Copie o código gerado para o arquivo models.py definitivo e aplique as seguintes melhorias:
    *   Renomeie as classes para seguir a convenção do Python (singular, CamelCase), ex: WorkOrders para WorkOrder.
    *   Ajuste os tipos de campo se necessário (ex: TextField para CharField com max\_length).
    *   Defina explicitamente o comportamento on\_delete para as ForeignKey.
    *   Adicione o atributo related\_name às ForeignKey para melhorar a clareza das consultas reversas.
    *   Implemente o método \_\_str\_\_(self) para fornecer uma representação legível do objeto, o que é extremamente útil no painel de administração do Django.

### 2.3. Implementando Lógica de Negócio: O Padrão de Camada de Serviço (Service Layer)

Um anti-padrão comum em projetos Django é o de "Fat Views" ou "Fat Models", onde a lógica de negócio complexa se espalha por views ou modelos, tornando o código difícil de testar, manter e reutilizar.24 A solução é adotar o padrão de Camada de Serviço.

Este padrão introduz uma camada de abstração (services.py) que desacopla a lógica de negócio da camada de apresentação (views) e da camada de dados (models).27 As funções de serviço encapsulam casos de uso específicos ou processos de negócio, como create\_work\_order\_for\_asset ou assign\_technician\_to\_ticket.

A Camada de Serviço atua como uma ponte entre os componentes centrados em dados do Django (Models, Admin) e os processos de negócio complexos do mundo real. O Django se destaca em representar entidades de dados (Models) e fornecer uma interface para elas (Admin). No entanto, um CMMS envolve processos, não apenas dados. Por exemplo, "concluir uma ordem de serviço" é um processo de negócio que pode envolver a alteração do status da ordem, a dedução de peças do inventário (inventory\_transactions) e a notificação do solicitante. Colocar essa lógica em uma view a acopla a uma requisição HTTP específica. Colocá-la em um método de modelo pode levar a modelos inchados que violam o Princípio da Responsabilidade Única. Uma função de serviço, como complete\_work\_order(work\_order, parts\_used), encapsula perfeitamente este processo. Ela pode ser chamada de uma view, de um endpoint de API, de uma tarefa agendada ou até mesmo do admin do Django, garantindo que a regra de negócio seja aplicada de forma consistente em toda a aplicação. Este padrão é o que eleva uma simples aplicação CRUD a uma robusta aplicação de negócio.

Os benefícios são claros: as views se tornam "magras", responsáveis apenas por lidar com o ciclo de requisição/resposta HTTP, enquanto a lógica de negócio principal reside em funções Python puras, que são facilmente testáveis e reutilizáveis.29 Além disso, operações complexas que modificam múltiplos modelos podem ser envolvidas em transações atômicas usando o decorador @transaction.atomic na camada de serviço, garantindo a integridade dos dados.30

### 2.4. Exemplo de Código: Operações CRUD para Ordens de Serviço

A seguir, um exemplo prático da implementação de um fluxo CRUD para WorkOrder, utilizando a arquitetura recomendada.

*   **src/apps/work\_orders/models.py (Modelo Refinado):**  
    Python  
    from django.db import models  
    from apps.assets.models import Asset  
    from apps.users.models import User  
      
    class WorkOrder(models.Model):  
    \# Campos do modelo baseados no schema, com tipos e relações ajustados  
    id = models.UUIDField(primary\_key=True, default=uuid.uuid4, editable=False)  
    title = models.CharField(max\_length=255)  
    description = models.TextField(blank=True, null=True)  
    asset = models.ForeignKey(Asset, on\_delete=models.CASCADE, related\_name='work\_orders')  
    assigned\_to = models.ForeignKey(  
    User, on\_delete=models.SET\_NULL, blank=True, null=True, related\_name='assigned\_work\_orders'  
    )  
    status = models.CharField(max\_length=50, default='open')  
    priority = models.IntegerField(default=3)  
    #... outros campos...  
    created\_at = models.DateTimeField(auto\_now\_add=True)  
    updated\_at = models.DateTimeField(auto\_now=True)  
      
    class Meta:  
    managed = False  
    db\_table = 'work\_orders'  
    ordering = \['-created\_at'\]  
      
    def \_\_str\_\_(self):  
    return f"{self.title} ({self.asset.name})"  
    
*   **src/apps/work\_orders/services.py (Camada de Serviço):**  
    Python  
    from django.db import transaction  
    from.models import WorkOrder  
    from apps.assets.models import Asset  
    from apps.users.models import User  
      
    class WorkOrderService:  
    @staticmethod  
    def get\_work\_order\_by\_id(work\_order\_id: str) -> WorkOrder:  
    return WorkOrder.objects.get(id=work\_order\_id)  
      
    @staticmethod  
    def get\_all\_work\_orders():  
    return WorkOrder.objects.select\_related('asset', 'assigned\_to').all()  
      
    @staticmethod  
    @transaction.atomic  
    def create\_work\_order(title: str, asset\_id: str, description: str = None) -> WorkOrder:  
    asset = Asset.objects.get(id=asset\_id)  
    work\_order = WorkOrder.objects.create(  
    title=title,  
    asset=asset,  
    description=description,  
    status='open'  
    )  
    \# Aqui poderia haver lógica adicional, como enviar uma notificação.  
    return work\_order  
      
    @staticmethod  
    @transaction.atomic  
    def assign\_technician(work\_order\_id: str, technician\_id: str) -> WorkOrder:  
    work\_order = WorkOrder.objects.get(id=work\_order\_id)  
    technician = User.objects.get(id=technician\_id, role='technician')  
    work\_order.assigned\_to = technician  
    work\_order.status = 'in\_progress'  
    work\_order.save()  
    return work\_order  
    
*   **src/apps/work\_orders/views.py (View "Magra"):**  
    Python  
    from django.shortcuts import render, redirect, get\_object\_or\_404  
    from django.views import View  
    from.services import WorkOrderService  
      
    class WorkOrderListView(View):  
    def get(self, request):  
    work\_orders = WorkOrderService.get\_all\_work\_orders()  
    return render(request, 'work\_orders/list.html', {'work\_orders': work\_orders})  
      
    class WorkOrderCreateView(View):  
    def post(self, request):  
    \# A validação de dados (ex: com um Django Form) foi omitida por brevidade  
    title = request.POST.get('title')  
    asset\_id = request.POST.get('asset\_id')  
    WorkOrderService.create\_work\_order(title=title, asset\_id=asset\_id)  
    return redirect('work\_order\_list')  
      
    Este exemplo utiliza views baseadas em classe do Django.31
*   **src/apps/work\_orders/urls.py (Roteamento):**  
    Python  
    from django.urls import path  
    from.views import WorkOrderListView, WorkOrderCreateView  
      
    urlpatterns =  
    

### 2.5. Gestão Segura de Configurações com Variáveis de Ambiente

É uma vulnerabilidade de segurança grave armazenar credenciais (senhas de banco de dados, SECRET\_KEY, etc.) diretamente no código-fonte. A prática recomendada é usar variáveis de ambiente, seguindo os princípios da metodologia "Twelve-Factor App". A biblioteca python-dotenv simplifica este processo no desenvolvimento local.

1.  **Instale a biblioteca:** pip install python-dotenv
2.  **Crie o arquivo .env:** Na raiz do projeto (mesmo nível que manage.py), crie um arquivo chamado .env.
3.  **Adicione ao .gitignore:** Adicione a linha .env ao seu arquivo .gitignore para garantir que este arquivo nunca seja enviado para o controle de versão.
4.  **Armazene os segredos:** Adicione as variáveis ao arquivo .env:  
    Ini, TOML  
    #.env  
    DEBUG=True  
    SECRET\_KEY='seu-secret-key-de-desenvolvimento'  
    DATABASE\_URL='postgres://user:password@host:port/dbname'  
    
5.  **Carregue as variáveis no settings.py:** Modifique seu arquivo de configurações base (src/config/settings/base.py) para carregar e usar essas variáveis.32  
    Python  
    import os  
    from pathlib import Path  
    from dotenv import load\_dotenv  
      
    \# Build paths inside the project like this: BASE\_DIR / 'subdir'.  
    BASE\_DIR = Path(\_\_file\_\_).resolve().parent.parent.parent.parent  
      
    \# Carrega as variáveis do arquivo.env  
    load\_dotenv(BASE\_DIR / '.env')  
      
    \# Agora, use as variáveis de ambiente  
    SECRET\_KEY = os.environ.get('SECRET\_KEY')  
    DEBUG = os.environ.get('DEBUG') == 'True'  
      
    \# Exemplo para configuração do banco de dados  
    \# É recomendado usar uma biblioteca como dj-database-url para parsear a URL  
    import dj\_database\_url  
    DATABASES = {  
    'default': dj\_database\_url.config(default=os.environ.get('DATABASE\_URL'))  
    }  
    

Esta abordagem garante uma separação limpa entre o código e a configuração, tornando a aplicação mais segura e portável entre diferentes ambientes.

## 3\. Guia Detalhado de Implantação em Windows Server

Esta seção fornece um guia prático e repetível para implantar a aplicação Django em um ambiente de produção on-premises com Windows Server. A stack tecnológica escolhida é robusta, segura e adequada para as particularidades do sistema operacional.

### 3.1. Preparação do Ambiente de Produção

Antes de iniciar a implantação, garanta que o servidor Windows esteja devidamente preparado:

1.  **Instale o Python:** Instale a versão necessária do Python para o projeto. Durante a instalação, marque a opção "Add Python to PATH" para facilitar o acesso via linha de comando.
2.  **Crie um Usuário Dedicado:** Por segurança, crie uma conta de usuário local no Windows com privilégios limitados (não administrador). A aplicação será executada sob este usuário para minimizar o impacto de uma possível falha de segurança.
3.  **Configure o Projeto:** Transfira o código-fonte da aplicação para um diretório no servidor (ex: C:\\apps\\cmms). Crie e ative um ambiente virtual (venv) dentro deste diretório e instale todas as dependências do projeto a partir do arquivo requirements.txt.

### 3.2. Servidor de Aplicação WSGI: Utilizando Waitress

O servidor de desenvolvimento do Django (manage.py runserver) é inseguro, ineficiente e inadequado para produção.34 Em um ambiente de produção, é necessário um servidor de aplicação WSGI (Web Server Gateway Interface) dedicado.

Enquanto Gunicorn e uWSGI são populares em ambientes Linux, eles não são suportados nativamente no Windows. **Waitress** é a solução recomendada: um servidor WSGI de qualidade de produção, escrito em Python puro, que é totalmente compatível com Windows e não possui dependências externas.36

1.  **Instalação:** No ambiente virtual ativado, instale o Waitress:  
    Bash  
    pip install waitress  
    
2.  **Execução:** Para iniciar a aplicação, use o comando waitress-serve, apontando para o objeto application no arquivo wsgi.py do seu projeto. O servidor deve escutar apenas em localhost (127.0.0.1), pois o acesso externo será gerenciado pelo proxy reverso (IIS).  
    Bash  
    waitress-serve --host=127.0.0.1 --port=8000 config.wsgi:application  
      
    (Assumindo que config é o nome do seu pacote de configuração do projeto, conforme a estrutura recomendada).

### 3.3. Configurando o IIS como Proxy Reverso com ARR

Não se deve expor o servidor Waitress diretamente à internet. Um proxy reverso como o IIS (Internet Information Services) deve ser colocado na frente. O IIS receberá as requisições HTTP/HTTPS, servirá arquivos estáticos de forma eficiente, terminará a conexão SSL e encaminhará as requisições de conteúdo dinâmico para o servidor de aplicação Waitress. Esta arquitetura é mais segura, performática e escalável.

1.  **Instalação:**
    *   Abra o "Server Manager" e use o "Add Roles and Features Wizard" para instalar a role "Web Server (IIS)".
    *   Instale o módulo **Application Request Routing (ARR)**. A maneira mais fácil é através do Microsoft Web Platform Installer.39
2.  **Configuração:**
    *   Abra o "IIS Manager".
    *   **Crie um novo Site:** Clique com o botão direito em "Sites" e selecione "Add Website". Preencha o nome do site (ex: CMMS), o caminho físico (pode apontar para o diretório do projeto, mas não é estritamente necessário para o proxy) e o hostname (ex: manutencao.minhaempresa.com).
    *   **Configure o Application Pool:** Vá para "Application Pools", encontre o pool criado para o seu site, clique com o botão direito e vá em "Basic Settings". Mude a versão do ".NET CLR version" para **"No Managed Code"**. O IIS está apenas atuando como proxy, não executando código.NET.39
    *   **Crie a Regra de URL Rewrite:** Selecione o seu novo site e abra o recurso "URL Rewrite". Clique em "Add Rule(s)..." e escolha o template "Reverse Proxy". Se for a primeira vez, o IIS pode pedir para habilitar o proxy no ARR. Na tela de configuração, insira o endereço onde o Waitress está escutando: http://127.0.0.1:8000.39 Salve a regra.

### 3.4. Habilitando Acesso Seguro com HTTPS via Let's Encrypt

Todo o tráfego para o sistema CMMS deve ser criptografado usando HTTPS. A ferramenta recomendada para automatizar a obtenção e renovação de certificados SSL/TLS gratuitos da Let's Encrypt em um ambiente Windows/IIS é o **win-acme**.

**win-acme** é um cliente ACME para Windows que se integra perfeitamente com o IIS. Ele automatiza a validação de domínio, a instalação do certificado e a criação de uma tarefa agendada no Windows para renovar o certificado automaticamente antes que ele expire.40

1.  **Download:** Baixe a última versão do win-acme do site oficial e extraia para um diretório permanente (ex: C:\\win-acme).43
2.  **Execução:** Abra um Command Prompt ou PowerShell **como Administrador**, navegue até o diretório do win-acme e execute wacs.exe.
3.  **Geração do Certificado:** Siga o assistente interativo:
    *   Escolha N para criar um novo certificado com as configurações padrão.
    *   O programa irá escanear os sites no IIS. Selecione o número correspondente ao site do CMMS que você criou.
    *   Confirme os hostnames para os quais o certificado será emitido.
    *   Aceite os termos de serviço e forneça um endereço de e-mail para notificações.
    *   O win-acme cuidará do resto: ele validará seu domínio, obterá o certificado, criará o binding HTTPS no IIS para a porta 443 e configurará a tarefa de renovação automática.42

### 3.5. Garantindo Resiliência: A Aplicação como Serviço do Windows

Executar o waitress-serve a partir de um terminal não é uma solução resiliente. Se o servidor for reiniciado ou a aplicação falhar, ela não será reiniciada automaticamente. A solução definitiva é registrar a aplicação como um Serviço do Windows.

Embora seja possível escrever um serviço em Python com pywin32, a abordagem mais simples e robusta é usar o **NSSM (the Non-Sucking Service Manager)**. O NSSM é um utilitário que envolve qualquer executável e o gerencia como um serviço do Windows, cuidando do início automático, monitoramento e reinicialização em caso de falha.44

A combinação do Waitress com o NSSM no Windows espelha a configuração comum de Gunicorn + systemd no Linux. O Waitress atua como o servidor de aplicação, enquanto o NSSM funciona como o gerenciador de processos. As capacidades de monitoramento e reinicialização automática do NSSM 46 fornecem a mesma resiliência que a diretiva Restart=always do systemd, oferecendo um modelo de implantação robusto e confiável em um ambiente Windows.

1.  **Download:** Baixe o NSSM do site oficial e coloque o nssm.exe em um local acessível no PATH do sistema ou em um diretório de ferramentas (ex: C:\\NSSM).
2.  **Instalação do Serviço:** Abra um Command Prompt **como Administrador** e execute:  
    Bash  
    nssm install CMMSAppService  
      
    Isso abrirá a interface gráfica de configuração do NSSM.45
3.  **Configuração:** Preencha os campos nas abas conforme a tabela abaixo. Esta configuração é crucial para o funcionamento correto do serviço.

**Tabela 2: Configuração do Serviço NSSM para a Aplicação Django**

| Aba | Parâmetro | Valor Exemplo | Justificativa |
| --- | --- | --- | --- |
| Application | Path | C:\apps\cmms\venv\Scripts\waitress-serve.exe | Caminho completo para o executável do servidor de aplicação dentro do ambiente virtual. |
|  | Startup directory | C:\apps\cmms\src | Diretório onde o comando será executado. Deve ser o diretório que contém manage.py ou o pacote de configuração para que os imports relativos funcionem. |
|  | Arguments | --host=127.0.0.1 --port=8000 config.wsgi:application | Argumentos passados para o waitress-serve, especificando o host, a porta e o objeto da aplicação WSGI. |
| Details | Display name | CMMS Application Server | Nome amigável que aparecerá na lista de serviços do Windows. |
|  | Description | Servidor WSGI para a aplicação de CMMS e Ticketing. | Descrição detalhada da finalidade do serviço. |
|  | Startup type | Automatic (Delayed Start) | Garante que o serviço inicie automaticamente com o sistema operacional, mas após outros serviços críticos, evitando problemas de inicialização. |
| Log on | Log on as | This account | Recomenda-se fortemente executar o serviço com a conta de usuário de privilégios limitados criada anteriormente. |
|  | Account name | .\cmms_user | Nome do usuário dedicado. |
|  | Password | ******** | Senha do usuário dedicado. |
| Exit actions | Restart application | On non-zero exit code ou Always | Configura o NSSM para reiniciar automaticamente a aplicação se ela falhar, garantindo alta disponibilidade. |
|  | Restart delay | 2000 ms | Adiciona um pequeno atraso (2 segundos) antes de tentar reiniciar o serviço para evitar loops de reinicialização rápidos em caso de falhas persistentes. |
| I/O | Output (stdout) | C:\apps\cmms\logs\stdout.log | Redireciona a saída padrão (logs de acesso, prints) para um arquivo de log, facilitando a depuração. |
|  | Error (stderr) | C:\apps\cmms\logs\stderr.log | Redireciona a saída de erro para um arquivo separado, essencial para diagnosticar falhas na aplicação. |

Após preencher esses campos, clique em "Install service". O serviço agora pode ser iniciado, parado e gerenciado através do console de Serviços do Windows (services.msc) ou via linha de comando (nssm start CMMSAppService). Com esta configuração finalizada, a aplicação CMMS estará implantada de forma segura, robusta e resiliente no servidor Windows on-premises.

#### Referências citadas

1.  Flask Alternatives A Deep Dive into Django FastAPI and CherryPy ..., acessado em outubro 15, 2025, [https://www.metacto.com/blogs/flask-alternatives-a-deep-dive-into-django-fastapi-and-cherrypy](https://www.metacto.com/blogs/flask-alternatives-a-deep-dive-into-django-fastapi-and-cherrypy)
2.  What are the differences between FastAPI, Flask, and Django? - Quora, acessado em outubro 15, 2025, [https://www.quora.com/What-are-the-differences-between-FastAPI-Flask-and-Django](https://www.quora.com/What-are-the-differences-between-FastAPI-Flask-and-Django)
3.  Python Framework - Flask Vs FastAPI Vs Django - Lucent Innovation, acessado em outubro 15, 2025, [https://www.lucentinnovation.com/blogs/technology-posts/flask-vs-fastapi-vs-django](https://www.lucentinnovation.com/blogs/technology-posts/flask-vs-fastapi-vs-django)
4.  The top 4 Python backend frameworks for building entry level AI projects, acessado em outubro 15, 2025, [https://pieces.app/blog/the-top-4-python-back-end-frameworks-for-your-next-project](https://pieces.app/blog/the-top-4-python-back-end-frameworks-for-your-next-project)
5.  Fast API vs Django: Which One Should You Choose for Your Next Web Project? - Apidog, acessado em outubro 15, 2025, [https://apidog.com/blog/fast-api-vs-django/](https://apidog.com/blog/fast-api-vs-django/)
6.  FastAPI vs Django: A Detailed Comparison in 2025 | by Tech Node ..., acessado em outubro 15, 2025, [https://medium.com/@technode/fastapi-vs-django-a-detailed-comparison-in-2025-1e70c65b9416](https://medium.com/@technode/fastapi-vs-django-a-detailed-comparison-in-2025-1e70c65b9416)
7.  FastAPI vs Django: Choosing the Right Python Framework in 2025 - RailsFactory, acessado em outubro 15, 2025, [https://railsfactory.com/blog/django-vs-fastapi-python-framework-comparison/](https://railsfactory.com/blog/django-vs-fastapi-python-framework-comparison/)
8.  SQL.txt
9.  How to integrate Django with a legacy database | Django ..., acessado em outubro 15, 2025, [https://docs.djangoproject.com/en/5.2/howto/legacy-databases/](https://docs.djangoproject.com/en/5.2/howto/legacy-databases/)
10.  django-admin and manage.py — Django 6.1.dev20250917202357 documentation, acessado em outubro 15, 2025, [https://django.readthedocs.io/en/latest/ref/django-admin.html](https://django.readthedocs.io/en/latest/ref/django-admin.html)
11.  Django ORM vs SQLAlchemy - DEV Community, acessado em outubro 15, 2025, [https://dev.to/atifwattoo/django-orm-vs-sqlalchemy-4o1i](https://dev.to/atifwattoo/django-orm-vs-sqlalchemy-4o1i)
12.  Automap — SQLAlchemy 2.0 Documentation, acessado em outubro 15, 2025, [http://docs.sqlalchemy.org/en/latest/orm/extensions/automap.html](http://docs.sqlalchemy.org/en/latest/orm/extensions/automap.html)
13.  Pros and Cons of manually creating an ORM for an existing database? - Stack Overflow, acessado em outubro 15, 2025, [https://stackoverflow.com/questions/38840193/pros-and-cons-of-manually-creating-an-orm-for-an-existing-database](https://stackoverflow.com/questions/38840193/pros-and-cons-of-manually-creating-an-orm-for-an-existing-database)
14.  Django ORM vs SqlAlchemy (an comparison) - Speaker Deck, acessado em outubro 15, 2025, [https://speakerdeck.com/danielacraciun/django-orm-vs-sqlalchemy-an-comparison](https://speakerdeck.com/danielacraciun/django-orm-vs-sqlalchemy-an-comparison)
15.  SQLAlchemy vs Django DB : r/Python - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/Python/comments/p03yh/sqlalchemy\_vs\_django\_db/](https://www.reddit.com/r/Python/comments/p03yh/sqlalchemy_vs_django_db/)
16.  Which is better between Django's ORM and SQLAlchemy, and is Django's interface easier and more intuitive as it seems to be, yet might there be crucial features missing with it? - Quora, acessado em outubro 15, 2025, [https://www.quora.com/Which-is-better-between-Djangos-ORM-and-SQLAlchemy-and-is-Django%E2%80%99s-interface-easier-and-more-intuitive-as-it-seems-to-be-yet-might-there-be-crucial-features-missing-with-it](https://www.quora.com/Which-is-better-between-Djangos-ORM-and-SQLAlchemy-and-is-Django%E2%80%99s-interface-easier-and-more-intuitive-as-it-seems-to-be-yet-might-there-be-crucial-features-missing-with-it)
17.  For people that use FastAPI & SQLAlchemy instead of Django REST Framework - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/django/comments/17mpj2w/for\_people\_that\_use\_fastapi\_sqlalchemy\_instead\_of/](https://www.reddit.com/r/django/comments/17mpj2w/for_people_that_use_fastapi_sqlalchemy_instead_of/)
18.  Comparing Django, Flask, and FastAPI: Python Web Framework with CRUD example, acessado em outubro 15, 2025, [https://python.plainenglish.io/comparing-django-flask-and-fastapi-python-web-framework-with-crud-example-9bd8d98cea7f](https://python.plainenglish.io/comparing-django-flask-and-fastapi-python-web-framework-with-crud-example-9bd8d98cea7f)
19.  FastAPI vs Django REST vs Flask: Who Wins in 2025? - Ingenious Minds Lab, acessado em outubro 15, 2025, [https://ingeniousmindslab.com/blogs/fastapi-django-flask-comparison-2025/](https://ingeniousmindslab.com/blogs/fastapi-django-flask-comparison-2025/)
20.  Flask, Django, or FastAPI? : r/Python - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/Python/comments/1dxcdiy/flask\_django\_or\_fastapi/](https://www.reddit.com/r/Python/comments/1dxcdiy/flask_django_or_fastapi/)
21.  Which is better for a new API, FastAPI or Django REST Framework? : r/Python - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/Python/comments/1mk2vx5/which\_is\_better\_for\_a\_new\_api\_fastapi\_or\_django/](https://www.reddit.com/r/Python/comments/1mk2vx5/which_is_better_for_a_new_api_fastapi_or_django/)
22.  Django best practices for writing better code and projects - Hostinger, acessado em outubro 15, 2025, [https://www.hostinger.com/tutorials/django-best-practices](https://www.hostinger.com/tutorials/django-best-practices)
23.  Scalable Django Architecture: Key Best Practices - Bluetick Consultants Inc., acessado em outubro 15, 2025, [https://www.bluetickconsultants.com/building-a-scalable-and-maintainable-architecture-for-large-scale-django-projects/](https://www.bluetickconsultants.com/building-a-scalable-and-maintainable-architecture-for-large-scale-django-projects/)
24.  Best practices for structuring Django projects? - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/django/comments/1my4oap/best\_practices\_for\_structuring\_django\_projects/](https://www.reddit.com/r/django/comments/1my4oap/best_practices_for_structuring_django_projects/)
25.  Best Practices for Structuring Django Projects? - Getting Started, acessado em outubro 15, 2025, [https://forum.djangoproject.com/t/best-practices-for-structuring-django-projects/39835](https://forum.djangoproject.com/t/best-practices-for-structuring-django-projects/39835)
26.  How to fetch data from postgres existing tables to Django? - Stack Overflow, acessado em outubro 15, 2025, [https://stackoverflow.com/questions/70770011/how-to-fetch-data-from-postgres-existing-tables-to-django](https://stackoverflow.com/questions/70770011/how-to-fetch-data-from-postgres-existing-tables-to-django)
27.  Against service layers in Django - James Bennett, acessado em outubro 15, 2025, [https://www.b-list.org/weblog/2020/mar/16/no-service/](https://www.b-list.org/weblog/2020/mar/16/no-service/)
28.  Organize Your Code with the Service Layer Pattern: A Simple Python Example, acessado em outubro 15, 2025, [https://dev.to/alexis\_jean/organize-your-code-with-the-service-layer-pattern-a-simple-python-example-2pnn](https://dev.to/alexis_jean/organize-your-code-with-the-service-layer-pattern-a-simple-python-example-2pnn)
29.  Django rest framework design patterns - Reddit, acessado em outubro 15, 2025, [https://www.reddit.com/r/django/comments/15oln5o/django\_rest\_framework\_design\_patterns/](https://www.reddit.com/r/django/comments/15oln5o/django_rest_framework_design_patterns/)
30.  Building a Robust Service Layer in Django with DRF | by Abhinav ..., acessado em outubro 15, 2025, [https://medium.com/@abhinav.dobhal/building-a-robust-service-layer-in-django-with-drf-3a3fc6a841c6](https://medium.com/@abhinav.dobhal/building-a-robust-service-layer-in-django-with-drf-3a3fc6a841c6)
31.  Build a Django Application to Perform CRUD Operations ..., acessado em outubro 15, 2025, [https://www.geeksforgeeks.org/python/build-a-django-application-to-perform-crud-operations/](https://www.geeksforgeeks.org/python/build-a-django-application-to-perform-crud-operations/)
32.  python-dotenv - PyPI, acessado em outubro 15, 2025, [https://pypi.org/project/python-dotenv/](https://pypi.org/project/python-dotenv/)
33.  environment variables - What is the use of python-dotenv? - Stack Overflow, acessado em outubro 15, 2025, [https://stackoverflow.com/questions/41546883/what-is-the-use-of-python-dotenv](https://stackoverflow.com/questions/41546883/what-is-the-use-of-python-dotenv)
34.  How to deploy Django, acessado em outubro 15, 2025, [https://docs.djangoproject.com/en/5.2/howto/deployment/](https://docs.djangoproject.com/en/5.2/howto/deployment/)
35.  Django Server as a Windows Service - Stack Overflow, acessado em outubro 15, 2025, [https://stackoverflow.com/questions/44699144/django-server-as-a-windows-service](https://stackoverflow.com/questions/44699144/django-server-as-a-windows-service)
36.  Pylons/waitress - A WSGI server for Python 3 - GitHub, acessado em outubro 15, 2025, [https://github.com/Pylons/waitress](https://github.com/Pylons/waitress)
37.  waitress 3.0.2 documentation - The Pylons Project, acessado em outubro 15, 2025, [https://docs.pylonsproject.org/projects/waitress/en/latest/](https://docs.pylonsproject.org/projects/waitress/en/latest/)
38.  Setting Up Django on a Windows Virtual Machine with Nginx and Waitress: A Complete Guide - Code Blog, acessado em outubro 15, 2025, [https://code-blog.ch/allgemein/setting-up-django-on-a-windows-virtual-machine-with-nginx-and-waitress-a-complete-guide/](https://code-blog.ch/allgemein/setting-up-django-on-a-windows-virtual-machine-with-nginx-and-waitress-a-complete-guide/)
39.  Here's a general guide to host a Django application on IIS - Programming Tutorial, acessado em outubro 15, 2025, [https://programtuts.wordpress.com/2024/09/20/heres-a-general-guide-to-host-a-django-application-on-iis/](https://programtuts.wordpress.com/2024/09/20/heres-a-general-guide-to-host-a-django-application-on-iis/)
40.  Successfully Issuing Let's Encrypt SSL Certificates in IIS with Win-ACME, acessado em outubro 15, 2025, [https://www.coryretherford.com/Lists/Posts/Post.aspx?ID=444](https://www.coryretherford.com/Lists/Posts/Post.aspx?ID=444)
41.  win-acme, acessado em outubro 15, 2025, [https://www.win-acme.com/](https://www.win-acme.com/)
42.  Installing and Automating Lets Encrypt Certificates on Windows - Akbarsait, acessado em outubro 15, 2025, [https://akbarsait.com/blog/2024/08/31/installing-and-automating-letsencrypt-certificates-on-windows/](https://akbarsait.com/blog/2024/08/31/installing-and-automating-letsencrypt-certificates-on-windows/)
43.  How to Secure IIS Websites with Win-Acme - The Vivio Knowledge Base, acessado em outubro 15, 2025, [https://kb.viviotech.net/display/KB/How+to+Secure+IIS+Websites+with+Win-Acme](https://kb.viviotech.net/display/KB/How+to+Secure+IIS+Websites+with+Win-Acme)
44.  A guide on running a Python script as a service on Windows & Linux. - GitHub, acessado em outubro 15, 2025, [https://github.com/oxylabs/python-script-service-guide](https://github.com/oxylabs/python-script-service-guide)
45.  How do you run a Python script as a service in Windows? \[closed\] - Stack Overflow, acessado em outubro 15, 2025, [https://stackoverflow.com/questions/32404/how-do-you-run-a-python-script-as-a-service-in-windows](https://stackoverflow.com/questions/32404/how-do-you-run-a-python-script-as-a-service-in-windows)
46.  NSSM - the Non-Sucking Service Manager, acessado em outubro 15, 2025, [https://nssm.cc/](https://nssm.cc/)
47.  Running a service using NSSM (Windows) - Hands-On Software Engineering with Python \[Book\] - O'Reilly Media, acessado em outubro 15, 2025, [https://www.oreilly.com/library/view/hands-on-software-engineering/9781788622011/66a35121-d465-4318-b566-264dc91b5829.xhtml](https://www.oreilly.com/library/view/hands-on-software-engineering/9781788622011/66a35121-d465-4318-b566-264dc91b5829.xhtml)