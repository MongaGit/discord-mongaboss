[![Docs](https://img.shields.io/badge/Documentação-DEPLOYMENT.md-007BFF?logo=read-the-docs&logoColor=white&style=flat-square)](./DEPLOYMENT.md)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?logo=docker&logoColor=white&style=flat-square)](https://hub.docker.com/r/lorthe/discord-mongaboss)

## 📘 **Mongaboss**

Este bot faz parte de um projeto com múltiplos bots exclusivos para um canal no Discord. 

Desenvolvido e mantido por mim, com foco em **containerização** e **ciclo de vida completo do projeto**. Todo o ambiente de desenvolvimento, testes e produção é gerenciado no meu **homelab**, utilizando **Proxmox** para virtualização e **Docker** para gerenciamento de containers.

---

### 🚀 **Comando `/cargo`**  
**Uso:** `/cargo <subcomando> [@user]`  
- **Sem `@user`:** Aplica a si mesmo.  
- **Com `@user`:** Aplica a outro usuário (somente para a role **🐵Monga**).  

---

### 🛠️ **Exemplos:**  
- **Atribuir `🎮game` a si mesmo:**  
  `/cargo game`  

- **Atribuir `🎮game` a outro usuário:**  
  `/cargo game @usuario` *(requer 🐵Monga)*  

---

### 📋 **Subcomandos Disponíveis:**  
**Todos os membros podem usar:**  
- `rpg` - 🎲RPG  
- `game` - 🎮Game  
- `art` - 🖌️Art  
- `skynet` - 🧊Skynet  

**Somente 🐵Monga pode usar:**  
- `rpg-mod` - 🎲RPG-Mod  
- `game-mod` - 🎮Game-Mod  
- `art-mod` - 🖌️Art-Mod  
- `skynet-mod` - 🧊Skynet-Mod  
- `admin` - Administrador *(temporário)*  

---

### ⏰ **Roles Temporárias:**  
- `/cargo admin` aplica a role **Administrador** temporariamente.  
  - **Tempo padrão:** 1440 min (24h).  

---

🔐 **Permissões:**  
- **Subcomandos básicos:** Todos os membros.  
- **Subcomandos de moderação:** Apenas membros com **🐵Monga**.

