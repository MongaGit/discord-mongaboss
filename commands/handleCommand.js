const { Permissions } = require('discord.js');

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
    const subcommand = interaction.options.getSubcommand();
    const roleKey = subcommand;  // Captura o subcomando como a role
    const target = interaction.options.getMember('user') || interaction.member;

    console.log(`Comando detectado: ${interaction.commandName}`);
    console.log(`Subcomando: ${subcommand}`);
    console.log(`Usuário alvo: ${target.user.tag}`);

    if (!rolesMap[roleKey]) {
        await interaction.reply('Cargo não reconhecido.');
        return;
    }

    try {
        if (roleKey === 'admin') {
            if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                await interaction.reply('Você não tem permissão para usar este comando.');
                return;
            }
            await manageRole(interaction, target, rolesMap[roleKey], true);
        } else {
            await manageRole(interaction, target, rolesMap[roleKey], false);
        }
    } catch (error) {
        console.error('Erro no comando:', error);
        await interaction.reply('Houve um erro ao executar o comando.');
    }
}

async function manageRole(interaction, target, roleName, temporary) {
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
        await interaction.reply(`Cargo "${roleName}" não encontrado.`);
        return;
    }

    await target.roles.add(role);
    await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName}.`);

    if (temporary) {
        setTimeout(async () => {
            await target.roles.remove(role);
            interaction.followUp(`${target.user.tag} teve o cargo ${roleName} removido após ${process.env.TIME_ROLE} minutos.`);
        }, parseInt(process.env.TIME_ROLE) * 60000);
    }
}

module.exports = { handleCommand };
