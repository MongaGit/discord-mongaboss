const { EmbedBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || '123456789012345678';
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga';

const rolesMap = {
    'rpg': '🎲rpg',
    'game': '🎮game',
    'dev-art': '🖌️dev-art',
    'rpg-mod': '🎲rpg-mod',
    'game-mod': '🎮game-mod',
    'dev-art-mod': '🖌️dev-art-mod',
    'admin': process.env.ROLE_ADMIN
};

module.exports = async (interaction, client) => {
    if (interaction.commandName === 'cargo') {
        const target = interaction.options.getMember('usuario');
        const roleName = interaction.options.getString('cargo');

        // Verifica se o cargo existe no rolesMap
        if (!rolesMap[roleName]) {
            await interaction.reply('Cargo não encontrado.');
            return;
        }

        const role = interaction.guild.roles.cache.find(r => r.name === rolesMap[roleName]);
        if (!role) {
            await interaction.reply(`Cargo "${rolesMap[roleName]}" não encontrado.`);
            return;
        }

        // Verifica se a role é restrita (admin ou termina com -mod)
        const isRestrictedRole = roleName === 'admin' || roleName.toLowerCase().endsWith('-mod');

        // Se for uma role restrita, verifica se o usuário tem a role monga
        if (isRestrictedRole) {
            const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
            if (!mongaRole || !interaction.member.roles.cache.has(mongaRole.id)) {
                await interaction.reply('Você não tem permissão para usar este comando.');
                return;
            }
        }

        // Verifica se o bot tem permissão para gerenciar cargos
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique minhas permissões.');
            return;
        }

        // Lógica de adicionar/remover cargo
        if (target.roles.cache.has(role.id)) {
            await target.roles.remove(role);
            await interaction.reply(`${target.user.tag} teve o cargo **${roleName}** removido.`);
        } else {
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo **${roleName}**.`);
        }

        // Enviar log no canal específico
        const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Registro de Cargo')
                .setDescription(`${interaction.user.tag} alterou o cargo de ${target.user.tag}`)
                .addFields(
                    { name: 'Cargo', value: roleName, inline: true },
                    { name: 'Ação', value: target.roles.cache.has(role.id) ? 'Removido' : 'Adicionado', inline: true }
                )
                .setColor('#f39c12')
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};
