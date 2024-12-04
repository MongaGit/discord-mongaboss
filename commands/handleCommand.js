//import .env
require('dotenv').config();;
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// Role fixa '🐵monga' se não houver var ROLE_MONGA_NAME
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga'

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
            // Verificação de permissões do bot
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique as minhas permissões.');
                return;
            }

            // Verificação se a role '🐵monga' existe para atribuir 'admin'
            if (roleKey === 'admin') {
                const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
                if (!mongaRole) {
                    await interaction.reply(`A role "${ROLE_MONGA_NAME}" não foi encontrada. Verifique a configuração do servidor.`);
                    return;
                }
            }

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
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`❌ ${target.user.tag} teve o cargo **${roleName}** removido.`)]
        });

        // Log de auditoria
        await sendAuditLog(`${interaction.user.tag} removeu o cargo **${roleName}** de ${target.user.tag}`);
    } else {
        await target.roles.add(role);
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#00ff00').setDescription(`✅ ${target.user.tag} agora tem o cargo **${roleName}**.`)]
        });

        // Log de auditoria
        await sendAuditLog(`${interaction.user.tag} atribuiu o cargo **${roleName}** a ${target.user.tag}`);
    }
}

async function sendAuditLog(content) {
    const logChannel = await interaction.client.channels.fetch(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(content)
            .setTimestamp();
        await logChannel.send({ embeds: [embed] });
    } else {
        console.error('Canal de log não encontrado.');
    }
}

module.exports = { handleCommand };
