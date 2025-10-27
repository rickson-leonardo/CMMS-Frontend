# FATOS DE CONFIGURAÇÃO DO PROJETO CMMS

Este documento é um registro técnico da configuração fundamental do projeto Django CMMS. Ele serve como uma fonte de verdade para a estrutura de código e ambiente.

## 1. Arquitetura e Estrutura

-   **Framework:** Django.
-   **Banco de Dados:** PostgreSQL, integrado a um schema pré-existente (`SQL.txt`).
-   **Estrutura de Diretórios:** O código-fonte reside em um diretório `src`, separando-o da configuração do ambiente (`venv`, `.env`).
    ```
    CMMS/
    ├── src/
    │   ├── apps/
    │   │   └── core/
    │   ├── config/
    │   └── manage.py
    ├── venv/
    └── .env
    ```
-   **Gerenciamento de Segredos:** As credenciais e chaves secretas são gerenciadas por um arquivo `.env` na raiz do projeto e carregadas via `python-dotenv`.

## 2. Configuração do Python Path e Aplicações

-   **Path:** O arquivo `src/manage.py` foi modificado para adicionar o diretório `src` ao `sys.path` do Python. Isso permite que módulos dentro de `src` (como `apps` e `config`) sejam importados diretamente.
-   **Pacote de Aplicações:** O diretório `src/apps` contém um arquivo `__init__.py`, tornando-o um pacote Python.
-   **Aplicação `core`:**
    -   A aplicação principal reside em `src/apps/core`.
    -   Em `src/apps/core/apps.py`, o atributo `name` da `CoreConfig` está definido como `'apps.core'`.
    -   Em `src/config/settings.py`, a aplicação está registrada em `INSTALLED_APPS` como `'apps.core'`.

## 3. Configuração da Base de Dados (`settings.py`)

-   A conexão com o banco de dados é configurada explicitamente no dicionário `DATABASES`.
-   As credenciais (`NAME`, `USER`, `PASSWORD`, `HOST`, `PORT`) são lidas a partir das variáveis de ambiente.
-   A opção `options: '-c search_path=public'` está definida para garantir que o Django opere no schema `public` do PostgreSQL.

## 4. Camada de Dados e Migrações

-   **Modelos:** O arquivo `src/apps/core/models.py` é a representação canônica e refatorada das tabelas do banco de dados. A diretiva `managed = False` está presente na classe `Meta` de todos os modelos, indicando que o Django não deve gerenciar o ciclo de vida do schema.
-   **Sincronização Inicial:** A sincronização entre os modelos Django e o banco de dados legado foi estabelecida através dos seguintes comandos:
    1.  `python src/manage.py migrate`: Para criar as tabelas internas do Django.
    2.  `python src/manage.py makemigrations core`: Para criar o arquivo de migração inicial baseado nos modelos.
    3.  `python src/manage.py migrate core --fake-initial`: Para marcar a migração inicial como "já aplicada" sem tentar executar o SQL, alinhando o estado do Django com o banco de dados existente.