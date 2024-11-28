require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommand } = require('./commands/handleCommand');

// definindo variáveis de ambiente ROLE_ADMIN e ROLE_MONGA  
process.env.ROLE_MONGA = '🐵monga';
process.env.ROLE_ADMIN = 'Administrador';
process.env.TIME_ROLE = '1440'; // Tempo em minutos | 1440 = 24 horas

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!admin') || message.author.bot) return;
    handleCommand(message);
});

client.login(process.env.DISCORD_TOKEN_01);