
# Docker Compose
```bash
docker run -d \
  -e DISCORD_TOKEN='seu_token_aqui'
  -e DISCORD_CLIENT_ID='seu_client_id_aqui' \
  -e DISCORD_SERVER='seu_server_id_aqui' \
  -e LOG_CHANNEL_ID=1097557088818954250 \
  -e ROLE_MONGA_NAME=🐵monga \
  -e ROLE_ADMIN=Administrador \
  -e TIME_ROLE=1440
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

