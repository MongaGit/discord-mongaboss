discord-mongaboss

# Mongaboss Discord Bot  
 
## Comandos Disponíveis  
   
- `!admin add`: Atribui a role "Administrador" ao usuário por um período de tempo definido em `TIME_ROLE`.  
- `!admin remove`: Remove a role "Administrador" do usuário se ele a possuir.  
- `!admin list`: Lista todos os usuários que atualmente possuem a role "Administrador".  
- `!admin help`: Exibe informações de ajuda sobre os comandos disponíveis.  
   
## Configuração e Uso

### Uso com Docker  
``` 
docker run -d \
  -e DISCORD_TOKEN="*********" \
  -e ROLE_ADMIN="Administrador" \
  -e ROLE_MONGA="🐵monga" \
  -e TIME_ROLE="1440" \
  --name mongaboss lorthe/discord-mongaboss:latest  
```
   
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

  
### Configuração Local   

```bash
# Install dependencies
npm install
```

```bash
# Run the bot
npm start
node bot.js
```
