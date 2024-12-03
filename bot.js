const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const handleCommand = require('./commands/handleCommand.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();

// Inicia o bot
client.once('ready', () => {
    console.log(`Bot iniciado como ${client.user.tag}`);
    client.guilds.cache.forEach(guild => {
        console.log(`Conectado a: ${guild.name}`);
    });
});

// Evento para interações
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    try {
        await handleCommand(interaction, client);
    } catch (error) {
        console.error('Erro ao processar comando:', error);
        await interaction.reply({ content: 'Houve um erro ao executar o comando.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
