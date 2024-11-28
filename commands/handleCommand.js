const { addAdminRole } = require('./addAdminRole');
const { removeAdminRole } = require('./removeAdminRole');
const { listAdminRoles } = require('./listAdminRoles');
const { showHelp } = require('./showHelp');

function handleCommand(message) {
    const parts = message.content.split(' ');
    const command = parts[1]; // e.g., add, remove, list, help  

    if (!message.member.roles.cache.some(role => role.name === process.env.ROLE_MONGA)) {
        return; // Ignora se o usuário não tem a role necessária  
    }

    switch (command) {
        case 'add':
            addAdminRole(message);
            break;
        case 'remove':
            removeAdminRole(message);
            break;
        case 'list':
            listAdminRoles(message);
            break;
        case 'help':
            showHelp(message);
            break;
        default:
            message.reply('Comando não reconhecido. Use `!admin help` para ver a lista de comandos.');
    }
}

module.exports = { handleCommand };  