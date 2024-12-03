﻿require('dotenv').config();
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
    console.log(`Logged in as ${client.user.tag}!`);
    if (process.env.DEPLOY_COMMANDS === '1') {
        await deployCommands();
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.guildId !== process.env.DISCORD_SERVER) {
        await interaction.reply({ content: 'Este bot só pode ser usado no servidor específico.', ephemeral: true });
        return;
    }
    handleCommand(interaction);
});

client.login(process.env.DISCORD_TOKEN);
