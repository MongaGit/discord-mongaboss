const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommand } = require('./commands/cargo');
require('dotenv').config();
const { deployCommands } = require('./deployCommands');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Bot logado como ${client.user.tag}`);

    // Verifica se a variável DEPLOY_COMMANDS está configurada para 1
    if (process.env.DEPLOY_COMMANDS === '1') {
        deployCommands().then(() => {
            console.log('Comandos de Slash implantados.');
        }).catch((error) => {
            console.error('Erro ao implantar comandos:', error);
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Chama o handler do comando de cargo
    await handleCommand(interaction);
});

client.login(process.env.BOT_TOKEN);
