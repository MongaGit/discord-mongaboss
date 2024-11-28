const timers = new Map();

async function addAdminRole(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    try {
        await message.member.roles.add(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} atribuída por 1 hora!`);
        logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} atribuída.`);

        clearTimeout(timers.get(message.author.id));
        const timer = setTimeout(async () => {
            if (message.member.roles.cache.has(adminRole.id)) {
                await message.member.roles.remove(adminRole);
                message.member.send(`Sua role ${process.env.ROLE_ADMIN} foi removida após 1 hora.`);
                logChannel.send(`${message.author.tag} teve a role ${process.env.ROLE_ADMIN} removida.`);
            }
        }, 3600000); // 1 hora em milissegundos

        timers.set(message.author.id, timer);
    } catch (error) {
        logChannel.send(`Erro ao adicionar a role: ${error}`);
        message.reply('Ocorreu um erro ao atribuir a role.');
    }
}

module.exports = { addAdminRole };
