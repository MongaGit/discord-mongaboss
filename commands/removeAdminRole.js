const timers = new Map();

async function removeAdminRole(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) { 
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    try {
        clearTimeout(timers.get(message.author.id));
        await message.member.roles.remove(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} removida!`);
        logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} removida.`);
    } catch (error) {
        logChannel.send(`Erro ao remover a role: ${error}`);
        message.reply('Ocorreu um erro ao remover a role.');
    }
}

module.exports = { removeAdminRole };