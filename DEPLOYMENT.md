# 📦 **Mongaboss Discord Bot**

Um bot de administração para servidores Discord, simplificando a gestão de roles temporárias e logs.

## Docker Hub
[**lorthe/discord-mongaboss**](https://hub.docker.com/r/lorthe/discord-mongaboss)

---

## ⚙️ **Configuração**

### Variáveis de Ambiente

Defina as variáveis de ambiente no arquivo `.env`:

| Variável             | Descrição                                  | Exemplo                              |
|----------------------|--------------------------------------------|--------------------------------------|
| `DISCORD_TOKEN`      | Token do bot                               | `xxxxxxxxxxxxxxxxxxxx`               |
| `DISCORD_CLIENT_ID`  | ID do cliente do bot                       | `1311076424395915415`                |
| `DISCORD_SERVER`     | ID do servidor                             | `406071925815902208`                 |
| `LOG_CHANNEL_ID`     | ID do canal de logs                        | `1097557088818954250`                |
| `ROLE_MONGA_NAME`    | Nome da role especial `monga`              | `🐵monga`                            |
| `ROLE_ADMIN`         | Nome da role de administrador              | `Administrador`                      |
| `TIME_ROLE`          | Duração (em minutos) para roles temporárias| `1440` (24 horas)                    |
| `DEPLOY_COMMANDS`    | Atualizar comandos no Discord?             | `1` (Sim), `0` (Não)                 |

---

### 🐳 **Deployment com Docker Compose**

1. Crie o arquivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongaboss:
    image: lorthe/discord-mongaboss:latest
    container_name: mongaboss
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
      - DISCORD_SERVER=${DISCORD_SERVER}
      - LOG_CHANNEL_ID=${LOG_CHANNEL_ID}
      - ROLE_MONGA_NAME=${ROLE_MONGA_NAME}
      - ROLE_ADMIN=${ROLE_ADMIN}
      - TIME_ROLE=${TIME_ROLE}
      - DEPLOY_COMMANDS=${DEPLOY_COMMANDS}
    restart: unless-stopped
```

2. Crie o arquivo `.env` no mesmo diretório:

```dotenv
DISCORD_TOKEN=SeuTokenAqui
DISCORD_CLIENT_ID=SeuClientIdAqui
DISCORD_SERVER=SeuServerIdAqui
LOG_CHANNEL_ID=SeuChannelIdAqui
ROLE_MONGA_NAME=🐵monga
ROLE_ADMIN=Administrador
TIME_ROLE=1440
DEPLOY_COMMANDS=1
```

3. Inicie o bot:

```bash
docker-compose up -d
```

---

### ⚡ **Rodando Manualmente com Docker**

```bash
docker run -d \
  -e DISCORD_TOKEN=seu_token \
  -e DISCORD_CLIENT_ID=seu_client_id \
  -e DISCORD_SERVER=seu_server_id \
  -e LOG_CHANNEL_ID=canal_logs \
  -e ROLE_MONGA_NAME=🐵monga \
  -e ROLE_ADMIN=Administrador \
  -e TIME_ROLE=1440 \
  -e DEPLOY_COMMANDS=1 \
  --name mongaboss lorthe/discord-mongaboss:latest
```

---

## 🚀 **Execução Local**

### Pré-requisitos
- Node.js  
- NPM  

### Passos:

```bash
# Clone o repositório
git clone https://github.com/MongaGit/discord-mongaboss.git
cd discord-mongaboss

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
nano .env

# Inicie o bot
node bot.js
```

---

## 📊 **Arquitetura do Sistema**

```mermaid
graph TB
    User((Usuário Discord))
    DiscordAPI[("Discord API<br>Serviço Externo")]

    subgraph "Container do Bot"
        BotClient["Cliente Discord<br>Discord.js"]
        
        subgraph "Gerenciamento de Comandos"
            CommandHandler["Handler de Comandos<br>Node.js"]
            CommandDeployer["Registrador de Comandos<br>REST API"]
            RoleManager["Gerenciador de Roles<br>Discord.js"]
        end
        
        subgraph "Serviços Auxiliares"
            AuditLogger["Logger de Auditoria<br>Discord.js"]
            TimeoutManager["Gerenciador de Timeouts<br>Node.js"]
        end
    end

    User -->|"Interação"| BotClient
    BotClient -->|"API Calls"| DiscordAPI

    BotClient --> CommandHandler
    CommandHandler --> RoleManager
    RoleManager --> AuditLogger
    RoleManager --> TimeoutManager
    
    CommandDeployer --> DiscordAPI
    AuditLogger --> DiscordAPI
```
