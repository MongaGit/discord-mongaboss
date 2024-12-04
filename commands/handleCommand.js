﻿const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// Variáveis de ambiente
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || '1097557088818954250';
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga';
const TIME_ROLE = parseInt(process.env.TIME_ROLE) || 1440; // Tempo em segundos (1440 = 24 horas)

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

        try {
            // Verifica se o bot tem permissão para gerenciar cargos
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique as minhas permissões.');
                return;
            }

            if (roleKey && rolesMap[roleKey]) {
                // Validação específica para a role 'admin'
                if (roleKey === 'admin' && !member.roles.cache.some(role => role.name === ROLE_MONGA_NAME)) {
                    await interaction.reply('Você precisa ter a role "🐵monga" para usar este comando.');
                    return;
                }

                // Verifica se a role '🐵monga' existe no servidor
                const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
                if (!mongaRole) {
                    await interaction.reply(`A role "${ROLE_MONGA_NAME}" não foi encontrada. Verifique a configuração do servidor.`);
                    return;
                }

                // Chama a função que adiciona ou remove a role
                await toggleRole(interaction, target, rolesMap[roleKey]);

                // Envia log de auditoria
                await sendAuditLog(interaction, target, roleKey);

                // Se a role for 'admin', define um temporizador para removê-la
                if (roleKey === 'admin') {
                    await setRoleTimeout(interaction, target, rolesMap[roleKey]);
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

async function toggleRole(interaction, target, roleName) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
        await interaction.reply(`Cargo "${roleName}" não encontrado.`);
        return;
    }

    // Verifica se o usuário já tem o cargo
    if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role);
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setDescription(`❌ ${target.user.tag} teve o cargo **${roleName}** removido.`)] });
    } else {
        await target.roles.add(role);
        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FF00').setDescription(`✅ ${target.user.tag} agora tem o cargo **${roleName}**.`)] });
    }
}

async function setRoleTimeout(interaction, target, roleName) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
        console.error(`Role "${roleName}" não encontrada.`);
        return;
    }

    // Configura um temporizador para remover o cargo após TIME_ROLE segundos
    setTimeout(async () => {
        // Remove o cargo após o tempo definido
        if (target.roles.cache.has(role.id)) {
            await target.roles.remove(role);
            await interaction.followUp({ embeds: [new EmbedBuilder().setColor('#FFCC00').setDescription(`🔔 O cargo **${roleName}** foi removido após 24 horas.`)] });
        }
    }, TIME_ROLE * 1000); // Converte o tempo de segundos para milissegundos
}

async function sendAuditLog(interaction, target, roleKey) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Log de Auditoria')
        .setDescription(`${interaction.user.tag} **${roleKey}** no usuário ${target.user.tag}`)
        .addFields(
            { name: 'Ação', value: target.roles.cache.has(rolesMap[roleKey]) ? 'Remoção' : 'Atribuição' },
            { name: 'Cargo', value: rolesMap[roleKey] },
            { name: 'Responsável', value: interaction.user.tag },
        )
        .setTimestamp()
        .setFooter({ text: 'Audit Log' });

    // Envia para o canal de log
    const logChannel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID);
    if (logChannel) {
        await logChannel.send({ embeds: [embed] });
    }
}

module.exports = { handleCommand };
