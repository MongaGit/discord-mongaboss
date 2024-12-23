﻿const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

// Map de cargos
const rolesMap = {
    'rpg': '🎲rpg',
    'game': '🎮game',
    'art': '🖌️art',
    'skynet': '🧊skynet',
    'rpg-mod': '🎲rpg-mod',
    'game-mod': '🎮game-mod',
    'art-mod': '🖌️art-mod',
    'skynet-mod': '🧊skynet-mod',
    'admin': 'Administrador'
};

// Construção do comando principal 'cargo' com subcomandos
const cargoCommand = new SlashCommandBuilder()
    .setName('cargo')
    .setDescription('Gerencia cargos no servidor');

// Adiciona os subcomandos para cada cargo
Object.keys(rolesMap).forEach(roleKey => {
    cargoCommand.addSubcommand(subcommand =>
        subcommand.setName(roleKey)
            .setDescription(`Atribui a role ${rolesMap[roleKey]} ao usuário`)
            .addUserOption(option => option.setName('user').setDescription('O usuário para atribuir o cargo').setRequired(false))
    );
});

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_SERVER),
            { body: [cargoCommand.toJSON()] },
        );
        console.log('Comandos (/) implantados com sucesso!');
    } catch (error) {
        console.error('Erro ao implantar comandos:', error);
    }
}

module.exports = { deployCommands };
