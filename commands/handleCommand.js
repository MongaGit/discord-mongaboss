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
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;

    if (commandName === 'cargo') {
        const subcommand = options.getSubcommand();
        const roleKey = subcommand;  // Capturando o subcomando como cargo
        const target = options.getMember('user') || member;

        try {
            if (roleKey && rolesMap[roleKey]) {
                // Verifica permissões para cargos especiais (admin ou mod)
                if (roleKey === 'admin' && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    await interaction.reply('Você não tem permissão para usar este comando.');
                    return;
                }
                await toggleRole(interaction, target, rolesMap[roleKey]);
            } else {
                await interaction.reply('Cargo não reconhecido.');
            }
        } catch (error) {
            console.error('Erro no comando:', error);
            await interaction.reply('Houve um erro ao executar o comando.');
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
        // Remove o cargo se o usuário já tiver
        await target.roles.remove(role);
        await interaction.reply(`${target.user.tag} teve o cargo ${roleName} removido.`);
    } else {
        // Adiciona o cargo se o usuário não tiver
        await target.roles.add(role);
        await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName}.`);
    }
}

module.exports = { handleCommand };