# Image  
FROM node:18.19.1-alpine

# MongaDEV Distributions
LABEL maintainer="brunopoleza@outlook.com.br"
LABEL version="1.0"
LABEL description="Bot Discord MongaBoss Administrador."
  
# Definir diretório de trabalho no container
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock)  
COPY package*.json ./

# Instalar dependências 
# --only=production para instalar apenas dependências de produção, omita se precisar de dependências de desenvolvimento
RUN npm install --only=production
  
# Copiar todos os arquivos do projeto para o diretório de trabalho
COPY . .

# O comando que será executado quando o container iniciar
CMD ["node", "bot.js"]
