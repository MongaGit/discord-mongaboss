const { REST } = require('@discordjs/rest');
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

const rest = new REST({ version: '9' }).setToken(process.env.MONGABOSS_DISCORD_TOKEN);

async function deployCommands(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.MONGABOSS_DISCORD_CLIENT_ID,
                    process.env.MONGABOSS_DISCORD_SERVER
                ),
                { body: [cargoCommand.toJSON()] }
            );
            console.log('✅ Comandos (/) implantados com sucesso!');
            return;
        } catch (error) {
            if (error.code === 'EAI_AGAIN') {
                console.log(`⚠️ Tentativa ${i + 1}/${retries} falhou. Problemas de conexão detectados.`);
                if (i < retries - 1) {
                    // Espera 5 segundos antes de tentar novamente
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    continue;
                }
            }
            console.error('❌ Erro ao implantar comandos:', error);
            throw error;
        }
    }
}

module.exports = { deployCommands };
