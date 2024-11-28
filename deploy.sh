#!/bin/bash  
  
# Definir nome da imagem e tag  
IMAGE_NAME="lorthe/discord-mongaboss"  
TAG="latest"  
  
# Efetuar login no Docker Hub
# verificar se não está Logando
if [ -z "$(docker info | grep Username)" ]; then
    echo "Efetuando login no Docker Hub..."
    docker login
fi

# Build da imagem Docker  
echo "Construindo imagem Docker..."  
docker build -t $IMAGE_NAME .  
  
# Tagging the image  
echo "Tagging the image..."  
docker tag $IMAGE_NAME $IMAGE_NAME:$TAG  
  
# Push da imagem para o Docker Hub  
echo "Enviando imagem para o Docker Hub..."  
docker push $IMAGE_NAME:$TAG  
  
echo "Deploy completo."  