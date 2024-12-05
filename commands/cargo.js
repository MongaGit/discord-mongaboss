const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { sendAuditLog } = require('../utils/auditLog');  // Importando a função sendAuditLog

// Variáveis de ambiente
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga';
const TIME_ROLE = parseInt(process.env.TIME_ROLE) || 1440;

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

async function handleCommand(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;

    if (commandName === 'cargo') {
        const subcommand = options.getSubcommand();
        const roleKey = subcommand;
        const target = options.getMember('user') || member;

        // Verifica se o membro tem a role "monga" ao usar @user
        if (options.getMember('user') && !member.roles.cache.some(role => role.name === ROLE_MONGA_NAME)) {
            await interaction.reply(`❌ Você precisa ter a role **${ROLE_MONGA_NAME}** para usar este comando com a menção de um usuário.`);
            return;
        }

        try {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique as minhas permissões.');
                return;
            }

            if (roleKey && rolesMap[roleKey]) {
                const role = interaction.guild.roles.cache.find(r => r.name === rolesMap[roleKey]);

                // Lógica específica para a role 'admin' com temporizador
                if (roleKey === 'admin') {
                    if (!member.roles.cache.some(role => role.name === ROLE_MONGA_NAME)) {
                        await interaction.reply(`Você precisa ter a role **${ROLE_MONGA_NAME}** para usar este comando.`);
                        return;
                    }

                    const adminRole = interaction.guild.roles.cache.find(r => r.name === 'Administrador');
                    if (!adminRole) {
                        await interaction.reply('A role "Administrador" não foi encontrada no servidor.');
                        return;
                    }

                    if (target.roles.cache.has(adminRole.id)) {
                        await target.roles.remove(adminRole);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription(`❌ ${target.user.tag} teve o cargo **Administrador** removido.`)] });
                        await sendAuditLog(interaction.client, `${target.user.tag} teve o cargo **Administrador** removido.`);
                    } else {
                        await target.roles.add(adminRole);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FF00').setDescription(`✅ ${target.user.tag} agora tem o cargo **Administrador**.`)] });
                        await sendAuditLog(interaction.client, `${target.user.tag} recebeu o cargo **Administrador**.`);

                        setRoleTimeout(interaction, target, adminRole, TIME_ROLE);
                    }
                } else if (role) {
                    // Lógica para roles simples e moderadoras
                    if (roleKey.includes('-mod') && !member.roles.cache.some(r => r.name === ROLE_MONGA_NAME)) {
                        await interaction.reply(`Você precisa ter a role "${ROLE_MONGA_NAME}" para usar este comando.`);
                        return;
                    }

                    if (target.roles.cache.has(role.id)) {
                        await target.roles.remove(role);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription(`❌ ${target.user.tag} teve o cargo **${role.name}** removido.`)] });
                        await sendAuditLog(interaction.client, `${target.user.tag} teve o cargo **${role.name}** removido.`);
                    } else {
                        await target.roles.add(role);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FF00').setDescription(`✅ ${target.user.tag} agora tem o cargo **${role.name}**.`)] });
                        await sendAuditLog(interaction.client, `${target.user.tag} recebeu o cargo **${role.name}**.`);
                    }
                } else {
                    await interaction.reply('Cargo não reconhecido.');
                }
            } else {
                await interaction.reply('Cargo não reconhecido.');
            }
        } catch (error) {
            console.error('Erro no comando:', error);
            if (!interaction.replied) {
                await interaction.reply('Houve um erro ao executar o comando. Tente novamente mais tarde.');
            }
        }
    }
}

async function setRoleTimeout(interaction, target, role, timeInSeconds) {
    setTimeout(async () => {
        try {
            const member = await interaction.guild.members.fetch(target.id);
            await member.roles.remove(role);
            await sendAuditLog(interaction.client, `O cargo **${role.name}** foi removido de ${target.user.tag} após ${timeInSeconds} segundos.`);
        } catch (error) {
            console.error('Erro ao tentar remover o cargo:', error);
        }
    }, timeInSeconds * 1000);
}

module.exports = { handleCommand };
