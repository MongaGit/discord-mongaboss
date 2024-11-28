require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { adminRoleCommand } = require('./commands/adminRoleCommand');

// definindo variáveis de ambiente ROLE_ADMIN e ROLE_MONGA
process.env.ROLE_MONGA = '🐵monga';
process.env.ROLE_ADMIN = 'Administrador';

//loga no console dos valores de process.env
console.log('process.env.DISCORD_TOKEN_01:', process.env.DISCORD_TOKEN_01);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', adminRoleCommand);

client.login(process.env.DISCORD_TOKEN_01);