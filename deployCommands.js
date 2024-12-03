const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('cargo')
        .setDescription('Gerencia cargos no servidor')
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('Lista todos os usuários com cargos específicos'))
        .addSubcommand(subcommand =>
            subcommand.setName('help')
                .setDescription('Exibe informações de ajuda sobre os comandos disponíveis'))
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

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_TOKEN, process.env.DISCORD_SERVER),
            { body: commands },
        );

        console.log('Comandos (/) implantados com sucesso!');
    } catch (error) {
        console.error(error);
    }
})();

module.exports = { deployCommands };

