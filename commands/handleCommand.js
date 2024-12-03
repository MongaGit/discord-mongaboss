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
        // Log para verificar o que é recebido no comando
        console.log(`Comando '/cargo' recebido: ${JSON.stringify(interaction.options.data)}`);

        const target = interaction.options.getMember('usuario');
        const roleName = interaction.options.getString('cargo');

        // Log para depuração: Verificar se o cargo foi capturado corretamente
        console.log(`Comando recebido para adicionar/remover o cargo: ${roleName}`);

        // Verifica se o nome do cargo foi passado corretamente
        if (!roleName) {
            await interaction.reply('Você precisa especificar um cargo.');
            return;
        }

        // Verifica se o cargo existe no rolesMap
        if (!rolesMap[roleName]) {
            await interaction.reply('Cargo não encontrado.');
            console.log(`Cargo não encontrado no mapa: ${roleName}`);
            return;
        }

        const roleNameMapped = rolesMap[roleName];
        console.log(`Role mapeada encontrada: ${roleNameMapped}`);

        // Verifica se a role existe no servidor
        const role = interaction.guild.roles.cache.find(r => r.name === roleNameMapped);
        if (!role) {
            await interaction.reply(`Cargo "${roleNameMapped}" não encontrado no servidor.`);
            console.log(`Cargo não encontrado no servidor: ${roleNameMapped}`);
            return;
        }

        // Verifica se a role é restrita (admin ou termina com -mod)
        const isRestrictedRole = roleName === 'admin' || roleName.toLowerCase().endsWith('-mod');

        // Se for uma role restrita, verifica se o usuário tem a role monga
        if (isRestrictedRole) {
            const mongaRole = interaction.guild.roles.cache.find(r => r.name === ROLE_MONGA_NAME);
            if (!mongaRole || !interaction.member.roles.cache.has(mongaRole.id)) {
                await interaction.reply('Você não tem permissão para usar este comando.');
                console.log(`Usuário ${interaction.user.tag} não tem permissão para usar este comando.`);
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
            await interaction.reply(`${target.user.tag} teve o cargo **${roleNameMapped}** removido.`);
        } else {
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo **${roleNameMapped}**.`);
        }

        // Enviar log no canal específico
        const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Registro de Cargo')
                .setDescription(`${interaction.user.tag} alterou o cargo de ${target.user.tag}`)
                .addFields(
                    { name: 'Cargo', value: roleNameMapped, inline: true },
                    { name: 'Ação', value: target.roles.cache.has(role.id) ? 'Removido' : 'Adicionado', inline: true }
                )
                .setColor('#f39c12')
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
};
