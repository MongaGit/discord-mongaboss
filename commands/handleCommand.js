const { EmbedBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();

// carregar LOG_CHANNEL_ID, se não existir colocar valor padrao
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || '123456789012345678';
// carregar ROLE_MONGA_NAME, se não existir colocar valor padrao
const ROLE_MONGA_NAME = process.env.ROLE_MONGA_NAME || '🐵monga';

module.exports = async (interaction, client) => {
    if (interaction.commandName === 'cargo') {
        const target = interaction.options.getMember('usuario');
        const roleName = interaction.options.getString('cargo');

        // Verifica permissões do usuário que executa o comando
        const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
        if (!mongaRole || !interaction.member.roles.cache.has(mongaRole.id)) {
            await interaction.reply('Você não tem permissão para usar este comando.');
            return;
        }

        // Verifica se o bot tem permissão para gerenciar cargos
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            await interaction.reply('Eu não tenho permissão para gerenciar cargos. Verifique minhas permissões.');
            return;
        }

        // Lógica de adicionar/remover cargo
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
