const { addAdminRole } = require('./addAdminRole');
const { removeAdminRole } = require('./removeAdminRole');
const { listAdmins } = require('./listAdmins');
const { showHelp } = require('./showHelp');

async function adminRoleCommand(message) {
    if (message.author.bot) return;

    const logChannel = message.guild.channels.cache.get(process.env.CHANNEL_LOGS);
    if (!logChannel) {
        console.log("Canal de logs não encontrado.");
        return;
    }

    const parts = message.content.split(' ');
    const command = parts[0].toLowerCase();
    const subCommand = parts[1];

    if (command === '!admin') {
        if (!message.member.roles.cache.some(role => role.name === process.env.ROLE_MONGA)) {
            message.reply('Você não tem permissão para usar este comando!');
            return;
        }

        switch (subCommand) {
            case 'add':
                await addAdminRole(message, logChannel);
                break;
            case 'remove':
                await removeAdminRole(message, logChannel);
                break;
            case 'list':
                await listAdmins(message, logChannel);
                break;
            case 'help':
                await showHelp(message);
                break;
            default:
                message.reply('Comando não reconhecido. Use `!admin help` para ver a lista de comandos.');
                break;  
        }
    }
}

module.exports = { adminRoleCommand };
