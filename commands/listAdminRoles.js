function listAdminRoles(message) {
    const role = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!role) {
        return message.reply('Role ${process.env.ROLE_ADMIN} não encontrada!');
    }

    const membersWithRole = role.members.map(member => member.user.tag).join('\n');
    message.reply(`🐵 com a role ${process.env.ROLE_ADMIN}:\n${membersWithRole}`);
}

module.exports = { listAdminRoles };  