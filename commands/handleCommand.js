const { PermissionsBitField } = require('discord.js');

// Role fixa '🐵monga' para verificação
const ROLE_MONGA_NAME = '🐵monga';

const rolesMap = {
    'rpg': '🎲rpg',
    'game': '🎮game',
    'dev-art': '🖌️dev-art',
    'admin': 'Administrador'  // Role que será concedida/removida
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
