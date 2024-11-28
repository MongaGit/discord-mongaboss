async function addAdminRole(message) {
    const adminRole = message.guild.roles.cache.find(role => role.name === process.env.ROLE_ADMIN);
    if (!adminRole) {
        return message.reply(`Role ${process.env.ROLE_ADMIN} não encontrada!`);
    }

    try {
        await message.member.roles.add(adminRole);
        // Converte minutos para horas  
        const hours = (parseInt(process.env.TIME_ROLE) / 60).toFixed(2);  // Converte os minutos em horas com duas casas decimais  
        message.reply(`Role ${process.env.ROLE_ADMIN} atribuída por ${hours} horas!`);

        setTimeout(async () => {
            if (message.member.roles.cache.has(adminRole.id)) {
                await message.member.roles.remove(adminRole);
                message.channel.send(`${message.member.user.tag} teve a role ${process.env.ROLE_ADMIN} removida após ${hours} horas.`);
            }
        }, parseInt(process.env.TIME_ROLE) * 60000); // Converte minutos para milissegundos  
    } catch (error) {
        message.reply('Ocorreu um erro ao atribuir a role.');
    }
}

module.exports = { addAdminRole };  