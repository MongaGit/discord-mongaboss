async function listAdmins(message, logChannel) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        logChannel.send('⚠️ Role admin não encontrada!');
        return message.reply('Role admin não encontrada!');
    }

    const admins = adminRole.members.map(member => member.user.tag).join(', ');
    message.reply(`Usuários com a role ${process.env.ROLE_ADMIN}: ${admins}`);
    logChannel.send(`Lista de usuários com a role ${process.env.ROLE_ADMIN}: ${admins}`);
}

module.exports = { listAdmins };