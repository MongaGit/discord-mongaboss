const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { sendAuditLog } = require('../utils/auditLog');  // Importando a função sendAuditLog

// Variáveis de ambiente
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || '1097557088818954250';
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga';
const TIME_ROLE = parseInt(process.env.TIME_ROLE) || 10; // Tempo em segundos

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
                // Validação para a role 'admin'
                if (roleKey === 'admin') {
                    if (!member.roles.cache.some(role => role.name === ROLE_MONGA_NAME)) {
                        await interaction.reply('Você precisa ter a role "🐵monga" para usar este comando.');
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
                        console.log(`${target.user.tag} já tinha o cargo 'Administrador'. Cargo removido.`);

                        // Envia log
                        await sendAuditLog(interaction.client, `${target.user.tag} teve o cargo **Administrador** removido imediatamente.`);
                    } else {
                        await target.roles.add(adminRole);
                        await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FF00').setDescription(`✅ ${target.user.tag} agora tem o cargo **Administrador**.`)] });

                        console.log(`Iniciando temporizador para remover o cargo 'Administrador' de ${target.user.tag} após ${TIME_ROLE} segundos.`);
                        await setRoleTimeout(interaction, target, adminRole, TIME_ROLE);

                        // Envia log
                        await sendAuditLog(interaction.client, `${target.user.tag} recebeu o cargo **Administrador**. Cargo será removido após ${TIME_ROLE} segundos.`);
                    }
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
    console.log(`Temporizador iniciado para remover o cargo "${role.name}" de ${target.user.tag} após ${timeInSeconds} segundos.`);

    setTimeout(async () => {
        try {
            const member = await interaction.guild.members.fetch(target.id);
            await member.roles.remove(role);
            console.log(`Cargo "${role.name}" removido de ${target.user.tag} após ${timeInSeconds} segundos.`);
            await interaction.followUp({ embeds: [new EmbedBuilder().setColor('#FFCC00').setDescription(`🔔 O cargo **${role.name}** foi removido de ${target.user.tag} após ${timeInSeconds} segundos.`)] });

            // Envia log
            await sendAuditLog(interaction.client, `O cargo **${role.name}** foi removido de ${target.user.tag} após ${timeInSeconds} segundos.`);

        } catch (error) {
            console.error('Erro ao tentar remover o cargo:', error);
        }
    }, timeInSeconds * 1000);
}

module.exports = { handleCommand };
