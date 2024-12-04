require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { deployCommands } = require('./deployCommands');
const { handleCommand } = require('./commands/handleCommand');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
    if (process.env.DEPLOY_COMMANDS === '1') {
        console.log('Implantando comandos...');
        await deployCommands();
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.log('Interação recebida:', interaction.commandName);
    if (interaction.guildId !== process.env.DISCORD_SERVER) {
        await interaction.reply({ content: 'Este bot só pode ser usado no servidor específico.', ephemeral: true });
        return;
    }

    try {
        await handleCommand(interaction);
    } catch (error) {
        console.error('Erro ao tratar interação:', error);
        await interaction.reply('Ocorreu um erro inesperado ao processar o comando.');
    }
});

// Envio de logs para o canal de auditoria
async function sendAuditLog(content) {
    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    console.log('Canal de log:', logChannel);
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


client.login(process.env.DISCORD_TOKEN);
