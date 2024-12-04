const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommand } = require('./commands/cargo');  // Comando de cargo
require('dotenv').config();  // Para usar variáveis de ambiente

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Bot logado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Chama o handler do comando de cargo
    await handleCommand(interaction);
});

client.login(process.env.BOT_TOKEN);
