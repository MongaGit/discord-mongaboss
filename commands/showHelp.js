function showHelp(message) {
    const helpMessage = `  
    **Comandos do Bot:**  
    - \`!admin add\`: Adiciona a role process.env.ROLE_ADMIN temporariamente.  
    - \`!admin remove\`: Remove a role process.env.ROLE_ADMIN se atribuída.  
    - \`!admin list\`: Lista todos os usuários com a role process.env.ROLE_ADMIN.  
    - \`!admin help\`: Mostra esta mensagem de ajuda.  
    `;
    message.reply(helpMessage);
}

module.exports = { showHelp };  