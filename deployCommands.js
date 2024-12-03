const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('cargo')
        .setDescription('Adiciona ou remove um cargo de um usuário.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para alterar o cargo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('cargo')
                .setDescription('Nome do cargo')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Implantando comandos (/)...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_SERVER),
            { body: commands }
        );
        console.log('Comandos implantados com sucesso!');
    } catch (error) {
        console.error('Erro ao implantar comandos:', error);
    }
})();
