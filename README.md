# DJE API

## Como Usar este Projeto

### Passo a Passo

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/erikfig/dje-api.git
   cd dje_api
   ```

2. **Instale as dependências**  
   Certifique-se de ter o `yarn` instalado e execute:  
   ```bash
   yarn install
   ```

3. **Configure as variáveis de ambiente**  
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:  
   ```plaintext
    JWT_SECRET=super_secret_key
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_PASSWORD=pass
    POSTGRES_USER=user
    POSTGRES_DBNAME=dje_api
    PUBLICATIONS_QUEUE=publications_queue
   ```

4. **Suba os serviços necessários (PostgreSQL e RabbitMQ)**  
   Use os exemplos de Docker abaixo para subir os serviços.

### Subir um container PostgreSQL

```bash
docker run --name postgres-dje -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dje_api -p 5432:5432 -d postgres
```

### Subir um container RabbitMQ

```bash
docker run --name rabbitmq-dje -p 5672:5672 -p 15672:15672 -d rabbitmq:management
```

Após subir o RabbitMQ, você pode acessar o painel de administração em:  
[http://localhost:15672](http://localhost:15672)  
Usuário padrão: `guest`  
Senha padrão: `guest`

5. **Inicie o servidor**  
   Para rodar o servidor em modo de desenvolvimento:  
   ```bash
   yarn dev
   ```

   Para rodar o servidor em produção:  
   ```bash
   yarn start
   ```

6. **Inicie o worker**  
   Para rodar o worker em modo de desenvolvimento:  
   ```bash
   yarn worker:dev
   ```

   Para rodar o worker em produção:  
   ```bash
   yarn worker
   ```

---

## Dependências

- **Node.js**: Ambiente de execução para JavaScript/TypeScript.
- **TypeScript**: Superset de JavaScript com tipagem estática.
- **Express**: Framework para criação de APIs.
- **amqplib**: Biblioteca para integração com RabbitMQ.
- **pg**: Cliente para PostgreSQL.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **jsonwebtoken**: Geração e validação de tokens JWT.

---

## Endpoints de Autenticação

### 1. Login

**Endpoint:**  
`POST /login`

**Descrição:**  
Este endpoint permite que um usuário faça login e receba um token JWT.

**Requisição:**  
O corpo da requisição deve conter as credenciais do usuário no seguinte formato:

```json
{
  "username": "admin",
  "password": "password"
}
```

**Resposta de Sucesso:**  
Se as credenciais forem válidas, o servidor retornará um token JWT:

```json
{
  "token": "seu_token_jwt_aqui"
}
```

**Resposta de Erro:**  
Se as credenciais forem inválidas, o servidor retornará:

- Código de status: `401 Unauthorized`
- Corpo da resposta:  
  ```plaintext
  Credenciais inválidas
  ```

---

### Configuração do JWT

Certifique-se de definir a variável de ambiente `JWT_SECRET` no arquivo `.env` para configurar a chave secreta usada na geração e validação dos tokens JWT:

```plaintext
JWT_SECRET=super_secret_key
```

---

## Worker para Atualização de Publicações

### Descrição

O worker é responsável por ouvir a fila `publications_queue` no RabbitMQ e atualizar a tabela `publications` com os dados recebidos. Ele processa mensagens em background e realiza a validação e inserção/atualização dos registros.

### Configuração

Certifique-se de definir as seguintes variáveis de ambiente no arquivo `.env`:

```plaintext
PUBLICATIONS_QUEUE=publications_queue
RABBITMQ_URL=amqp://localhost
```

### Execução

Para executar o worker, utilize o seguinte comando:

```bash
yarn worker
```

Para executar o worker em modo de desenvolvimento com reinicialização automática:

```bash
yarn worker:dev
```

### Exemplo de Dados Recebidos

O worker processa mensagens no seguinte formato:

```json
{
  "numero_processo": null,
  "data_disponibilizacao": "2025-04-24",
  "autores": null,
  "advogados": null,
  "valor_principal": null,
  "juros_moratorios": null,
  "honorarios_adv": null,
  "conteudo_publicacao": "Publicação Oficial do Tribunal de Justiça...",
  "status": "nova",
  "reu": "Instituto Nacional do Seguro Social - INSS"
}
```

### Campos Permitidos

Os seguintes campos são permitidos para validação e persistência:

- `numero_processo` (string ou null)
- `data_disponibilizacao` (string no formato `YYYY-MM-DD` ou null)
- `autores` (string ou null)
- `advogados` (string ou null)
- `valor_principal` (string ou null)
- `juros_moratorios` (string ou null)
- `honorarios_adv` (string ou null)
- `conteudo_publicacao` (string ou null)
- `status` (string ou null)
- `reu` (string ou null)

---

## Endpoints de Publicações

### 1. Listar Publicações

**Endpoint:**  
`GET /publications`

**Descrição:**  
Retorna uma lista paginada de publicações.

**Parâmetros de Query:**  
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Número de itens por página (padrão: 10)

**Resposta de Sucesso:**  
```json
[
  {
    "id": 1,
    "numero_processo": "12345",
    "data_disponibilizacao": "2025-04-24",
    "autores": "Autor 1",
    "advogados": "Advogado 1",
    "valor_principal": "1000.00",
    "juros_moratorios": "50.00",
    "honorarios_adv": "200.00",
    "conteudo_publicacao": "Publicação Oficial...",
    "status": "nova",
    "reu": "Instituto Nacional do Seguro Social - INSS"
  }
]
```

---

### 2. Obter Publicação por ID

**Endpoint:**  
`GET /publications/:id`

**Descrição:**  
Retorna os detalhes de uma publicação específica.

**Resposta de Sucesso:**  
```json
{
  "id": 1,
  "numero_processo": "12345",
  "data_disponibilizacao": "2025-04-24",
  "autores": "Autor 1",
  "advogados": "Advogado 1",
  "valor_principal": "1000.00",
  "juros_moratorios": "50.00",
  "honorarios_adv": "200.00",
  "conteudo_publicacao": "Publicação Oficial...",
  "status": "nova",
  "reu": "Instituto Nacional do Seguro Social - INSS"
}
```

---

### 3. Atualizar Publicação

**Endpoint:**  
`PUT /publications/:id`

**Descrição:**  
Atualiza os campos de uma publicação existente.

**Requisição:**  
O corpo da requisição deve conter os campos a serem atualizados. Apenas os campos permitidos serão aceitos.

**Exemplo de Corpo da Requisição:**  
```json
{
  "numero_processo": "54321",
  "status": "atualizada"
}
```

**Resposta de Sucesso:**  
```json
{
  "id": 1,
  "numero_processo": "54321",
  "data_disponibilizacao": "2025-04-24",
  "autores": "Autor 1",
  "advogados": "Advogado 1",
  "valor_principal": "1000.00",
  "juros_moratorios": "50.00",
  "honorarios_adv": "200.00",
  "conteudo_publicacao": "Publicação Oficial...",
  "status": "atualizada",
  "reu": "Instituto Nacional do Seguro Social - INSS"
}
```

**Resposta de Erro:**  
Se os campos enviados forem inválidos, o servidor retornará:

- Código de status: `400 Bad Request`
- Corpo da resposta:  
  ```json
  {
    "errors": ["O campo 'numero_processo' deve ser uma string ou null."]
  }
  ```
