async function removeAdminRole(message) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (adminRole && message.member.roles.cache.has(adminRole.id)) {
        await message.member.roles.remove(adminRole);
        message.reply(`Role ${process.env.ROLE_ADMIN} removida!`);
    }
}

module.exports = { removeAdminRole };  