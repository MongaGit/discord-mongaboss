const { CommandInteraction, Permissions } = require('discord.js');

const rolesMap = {
    'rpg': '🎲rpg',
    'game': '🎮game',
    'dev-art': '🖌️dev-art',
    'rpg-mod': '🎲rpg-mod',
    'game-mod': '🎮game-mod',
    'dev-art-mod': '🖌️dev-art-mod',
    'admin': process.env.ROLE_ADMIN
};

async function handleCommand(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;

    if (commandName === 'cargo') {
        const subcommand = options.getSubcommand();
        const roleKey = options.getString('role');
        const target = options.getMember('user') || member; // Se não especificado, aplica ao próprio usuário

        try {
            switch (subcommand) {
                case 'list':
                    await listRoles(interaction);
                    break;
                case 'help':
                    await interaction.reply('Comandos disponíveis: /cargo [role], /cargo list, /cargo help');
                    break;
                default:
                    if (roleKey) {
                        if (rolesMap[roleKey]) {
                            if (roleKey === 'admin' || roleKey.includes('-mod')) {
                                // Verifica se o membro tem permissões para dar cargos admin/mod
                                if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                    await manageRole(interaction, target, rolesMap[roleKey], true);
                                } else {
                                    await interaction.reply('Você não tem permissão para usar este comando.');
                                }
                            } else {
                                await manageRole(interaction, target, rolesMap[roleKey], false);
                            }
                        } else {
                            await interaction.reply('Cargo não reconhecido.');
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error('Erro no comando:', error);
            await interaction.reply('Houve um erro ao executar o comando.');
        }
    }
}

async function manageRole(interaction, target, roleName, temporary) {
    try {
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            await interaction.reply(`Cargo "${roleName}" não encontrado.`);
            return;
        }

        if (temporary && roleName === process.env.ROLE_ADMIN) {
            // Aplica o cargo temporariamente
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName} por ${process.env.TIME_ROLE} minutos.`);
            setTimeout(async () => {
                await target.roles.remove(role);
                interaction.followUp(`${target.user.tag} teve o cargo ${roleName} removido após ${process.env.TIME_ROLE} minutos.`);
            }, parseInt(process.env.TIME_ROLE) * 60000);
        } else {
            // Aplica o cargo permanentemente
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName}.`);
        }
    } catch (error) {
        console.error('Erro ao adicionar cargo:', error);
        await interaction.reply('Não foi possível adicionar o cargo.');
    }
}

async function listRoles(interaction) {
    const rolesString = interaction.guild.roles.cache
        .filter(role => Object.values(rolesMap).includes(role.name))
        .map(role => `${role.name}: ${role.members.size} membros`)
        .join('\n');
    await interaction.reply(`Cargos disponíveis e suas contagens:\n${rolesString}`);
}

module.exports = { handleCommand };
