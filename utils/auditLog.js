const { EmbedBuilder } = require('discord.js');

async function sendAuditLog(message) {
    const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    const embed = new EmbedBuilder()
        .setColor('#FF5733')
        .setDescription(message)
        .setTimestamp();
    
    await channel.send({ embeds: [embed] });
}

module.exports = { sendAuditLog };
