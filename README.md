
# Mongaboss: Bot de Administração para Discord

Este container Docker executa o **Mongaboss**, um bot de administração para servidores Discord. O bot gerencia roles (cargos) com comandos personalizados, como o `/cargo`, e pode ser configurado facilmente com variáveis de ambiente.

# Docker Image 

[https://hub.docker.com/r/lorthe/discord-mongaboss](https://hub.docker.com/r/lorthe/discord-mongaboss)

## Funcionalidades Principais

- Atribuição de roles personalizadas através de comandos de slash (`/cargo`).
- Gerenciamento de roles temporárias (como administrador temporário).
- Log de atividades em um canal específico.

## Como Usar

### 1. Variáveis de Ambiente

Para configurar o bot, você precisa definir as seguintes variáveis de ambiente:

| Variável             | Descrição                                  | Exemplo                              |
|----------------------|--------------------------------------------|--------------------------------------|
| `DISCORD_TOKEN`      | Token do seu bot do Discord                | `********-*********-**`              |
| `DISCORD_CLIENT_ID`  | ID do cliente do bot                       | `1311076424395915415`                |
| `DISCORD_SERVER`     | ID do servidor onde o bot será usado       | `406071925815902208`                 |
| `LOG_CHANNEL_ID`     | ID do canal onde logs serão enviados       | `1097557088818954250`                |
| `ROLE_MONGA_NAME`    | Nome do cargo especial `monga`             | `🐵monga`                            |
| `ROLE_ADMIN`         | Nome do cargo de administrador             | `Administrador`                      |
| `TIME_ROLE`          | Duração (em minutos) para roles temporárias| `1440` (24 horas)                    |
| `DEPLOY_COMMANDS`    | Define se os comandos serão atualizados    | `1` (para sim, 0 para não)           |

### 2. Rodando com Docker Compose

Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:

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

### 3. Criar um Arquivo `.env`

Crie um arquivo `.env` no mesmo diretório com suas configurações:

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

### 4. Iniciando o Bot

Execute o seguinte comando:

```bash
docker-compose up -d
```

O bot estará pronto para uso no seu servidor Discord!

## Licença

Este projeto é licenciado sob a [MIT License](https://opensource.org/licenses/MIT).













# Docker Compose
```bash
docker run -d \
  -e DISCORD_TOKEN=****** \
  -e DISCORD_CLIENT_ID=****** \
  -e DISCORD_SERVER=****** \
  -e LOG_CHANNEL_ID=1097557088818954250 \
  -e ROLE_MONGA_NAME=🐵monga \
  -e ROLE_ADMIN=Administrador \
  -e TIME_ROLE=1440 \
  -e DEPLOY_COMMANDS=1 \
  --name mongaboss lorthe/discord-mongaboss:latest
````
### Pré-requisitos  

- Node.js  
- NPM  
- Docker (para deployment usando Docker)  

### Configuração Local

1. Clone o repositório:  
   ```  
   git clone https://github.com/MongaGit/discord-mongaboss.git  
   cd discord-mongaboss  
   ```  
3. Instale as dependências:
   ```  
   npm install  
   ```  
4. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:  
   ```  
   DISCORD_TOKEN=seu_token_discord  
   TIME_ROLE=60  
   ```  
5. Para iniciar o bot:  
   ```  
   node bot.js  
   ```  

### Deployment Para Docker
```  
docker build -t lorthe/discord-mongaboss .
docker push lorthe/discord-mongaboss 
```  

### Deployment Para Docker
```bash
chmod +x deploy.sh
./deploy.sh  
```

