require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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

client.login(process.env.DISCORD_TOKEN);
