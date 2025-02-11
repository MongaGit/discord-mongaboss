const { EmbedBuilder } = require('discord.js');
const MONGABOSS_LOG_CHANNEL_ID = process.env.MONGABOSS_LOG_CHANNEL_ID || '1097557088818954250';

async function sendAuditLog(client, message) {
    const channel = await client.channels.fetch(process.env.MONGABOSS_LOG_CHANNEL_ID);
    const embed = new EmbedBuilder()
        .setColor('#FF5733')
        .setDescription(message)
        .setTimestamp();

    await channel.send({ embeds: [embed] });
}

module.exports = { sendAuditLog };
