require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommand } = require('./commands/handleCommand');

// definindo variáveis de ambiente ROLE_ADMIN e ROLE_MONGA  se elas não tiverem sido definidas
if (!process.env.ROLE_ADMIN) {
    process.env.ROLE_ADMIN = '🐵monga';
}
if (!process.env.ROLE_MONGA) {
    process.env.ROLE_MONGA = 'Administrador';
}
if (!process.env.TIME_ROLE) {
    process.env.TIME_ROLE = '1440';
}

// log dos valores das variáveis de ambiente
console.log (`ROLE_ADMIN: ${process.env.ROLE_ADMIN}`);
console.log (`ROLE_MONGA: ${process.env.ROLE_MONGA}`);
console.log (`TIME_ROLE: ${process.env.TIME_ROLE}`);

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

client.login(process.env.DISCORD_TOKEN);