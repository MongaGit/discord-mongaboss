async function showHelp(message) {
    const helpMessage = `
        Comandos disponíveis:
        - \`!admin add\` - atribui a role admin ao usuário por 1 hora
        - \`!admin remove\` - remove a role admin do usuário
        - \`!admin list\` - lista todos os usuários com a role admin
        - \`!admin help\` - exibe esta mensagem de ajuda
    `;  
    message.reply(helpMessage);
}  
  
module.exports = { showHelp };