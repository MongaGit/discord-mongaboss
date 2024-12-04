
````bot.js
require('dotenv').config();
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
    console.log(`Bot iniciado como ${client.user.tag}`);
    if (process.env.DEPLOY_COMMANDS === '1') {
        console.log('Implantando comandos...');
        await deployCommands();
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.log('Interação recebida:', interaction.commandName);
    if (interaction.guildId !== process.env.DISCORD_SERVER) {
        await interaction.reply({ content: 'Este bot só pode ser usado no servidor específico.', ephemeral: true });
        return;
    }

    try {
        await handleCommand(interaction);
    } catch (error) {
        console.error('Erro ao tratar interação:', error);
        await interaction.reply('Ocorreu um erro inesperado ao processar o comando.');
    }
});

client.login(process.env.DISCORD_TOKEN);
```

````deployCommands.js
const { REST } = require('@discordjs/rest');
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

````


````commands/handleCommand.js
const { PermissionsBitField } = require('discord.js');

// Role fixa '🐵monga' para verificação
const ROLE_MONGA_NAME = '🐵monga';

const rolesMap = {
    'rpg': '🎲rpg',
    'game': '🎮game',
    'dev-art': '🖌️dev-art',
    'rpg-mod': '🎲rpg-mod',
    'game-mod': '🎮game-mod',
    'dev-art-mod': '🖌️dev-art-mod',
    'admin': 'Administrador'
};

async function handleCommand(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;

    if (commandName === 'cargo') {
        const subcommand = options.getSubcommand();
        const roleKey = subcommand;
        const target = options.getMember('user') || member;

        try {
            if (roleKey && rolesMap[roleKey]) {
                // Validação específica para a role 'admin'
                if (roleKey === 'admin' && !member.roles.cache.some(role => role.name === ROLE_MONGA_NAME)) {
                    await interaction.reply('Você precisa ter a role "🐵monga" para usar este comando.');
                    return;
                }
                await toggleRole(interaction, target, rolesMap[roleKey]);
            } else {
                await interaction.reply('Cargo não reconhecido.');
            }
        } catch (error) {
            console.error('Erro no comando:', error);
            await interaction.reply('Houve um erro ao executar o comando. Tente novamente mais tarde.');
        }
    }
}

async function toggleRole(interaction, target, roleName) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
        await interaction.reply(`Cargo "${roleName}" não encontrado.`);
        return;
    }

    // Verifica se o usuário já tem o cargo
    if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role);
        await interaction.reply(`${target.user.tag} teve o cargo "${roleName}" removido.`);
    } else {
        await target.roles.add(role);
        await interaction.reply(`${target.user.tag} agora tem o cargo "${roleName}".`);
    }
}

module.exports = { handleCommand };
````






O projeto está funcionando tudo corretamente assim. Analise os tres arquivos principais do projeto, bot.js, deployCommands.js e commands/handleCommand.js.
Aquero realizar algumas implementações:

1. Log de Auditoria
Adicionar um log de auditoria para registrar quem concedeu ou removeu roles. Isso pode ser útil para monitorar as ações administrativas no servidor. vamos usar o .env para a variável LOG_CHANNEL_ID para armazenar o ID do canal de log.

2. Tratamento de Permissões
Verificar se o bot tem permissões suficientes para adicionar ou remover roles. Isso evita erros caso o bot não tenha a permissão necessária.
```exemplo
if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique as minhas permissões.');
    return;
}
```
3. Feedback Visual
Melhorar as mensagens enviadas ao usuário usando embeds para um visual mais atraente.
```exemplo
const { EmbedBuilder } = require('discord.js');

async function toggleRole(interaction, target, roleName) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
        await interaction.reply(`Cargo "${roleName}" não encontrado.`);
        return;
    }

    const embed = new EmbedBuilder().setColor('#0099ff');

    if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role);
        embed.setDescription(`❌ ${target.user.tag} teve o cargo **${roleName}** removido.`);
    } else {
        await target.roles.add(role);
        embed.setDescription(`✅ ${target.user.tag} agora tem o cargo **${roleName}**.`);
    }

    await interaction.reply({ embeds: [embed] });
}
```
5. Erro de Role Não Encontrada
Pode ser útil tratar o caso em que a role '🐵monga' não existe no servidor:

````exemplo
const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
if (!mongaRole) {
    await interaction.reply(`A role "${ROLE_MONGA_NAME}" não foi encontrada. Verifique a configuração do servidor.`);
    return;
}
````
