﻿const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('cargo')
        .setDescription('Gerencia cargos no servidor')
        .addSubcommand(subcommand =>
            subcommand.setName('rpg')
                .setDescription('Atribui a role RPG ao usuário')
                .addUserOption(option => option.setName('user').setDescription('O usuário para atribuir o cargo').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('game')
                .setDescription('Atribui a role Game ao usuário')
                .addUserOption(option => option.setName('user').setDescription('O usuário para atribuir o cargo').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('dev-art')
                .setDescription('Atribui a role Dev-Art ao usuário')
                .addUserOption(option => option.setName('user').setDescription('O usuário para atribuir o cargo').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand.setName('admin')
                .setDescription('Atribui a role Administrador temporariamente')
                .addUserOption(option => option.setName('user').setDescription('O usuário para atribuir o cargo').setRequired(false)))
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_SERVER),
            { body: commands },
        );
        console.log('Comandos (/) implantados com sucesso!');
    } catch (error) {
        console.error('Erro ao implantar comandos:', error);
    }
}

module.exports = { deployCommands };
