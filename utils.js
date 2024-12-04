// utils.js
const { EmbedBuilder } = require('discord.js');

// Função para enviar logs de auditoria
async function sendAuditLog(client, content) {
    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(content)
            .setTimestamp();
        await logChannel.send({ embeds: [embed] });
    } else {
        console.error('Canal de log não encontrado.');
    }
}

module.exports = { sendAuditLog };
