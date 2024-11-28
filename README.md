discord-mongaboss

# Mongaboss Discord Bot  
 
## Comandos Disponíveis  
   
- `!admin add`: Atribui a role "Administrador" ao usuário por um período de tempo definido em `TIME_ROLE`.  
- `!admin remove`: Remove a role "Administrador" do usuário se ele a possuir.  
- `!admin list`: Lista todos os usuários que atualmente possuem a role "Administrador".  
- `!admin help`: Exibe informações de ajuda sobre os comandos disponíveis.  
   
## Configuração e Uso  
   
### Pré-requisitos  
   
- Node.js  
- NPM  
- Docker (para deployment usando Docker)  
   
### Configuração Local  
   
1. Clone o repositório:  
   ```  
   git clone https://github.com/MongaGit/discord-mongaboss.git  
   ```  
2. Entre no diretório do projeto:  
   ```  
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
   
### Uso com Docker  
   
1. Construa a imagem Docker:  
   ```  
   docker build -t lorthe/discord-mongaboss .  
   ```  
2. Faça login no Docker Hub:  
   ```  
   docker login  
   ```  
3. Envie a imagem para o Docker Hub:  
   ```  
   docker push lorthe/discord-mongaboss  
   ```  
4. Execute o bot usando Docker Compose:  
   ```  
   docker-compose up -d  
   ```  
   









  
### Configuração Local  
  
1. Clone o repositório:  

```bash
# Install dependencies
npm install
```

```bash
# Run the bot
npm start
node bot.js
```
