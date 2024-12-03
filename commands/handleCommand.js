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

    console.log(`Comando detectado: ${interaction.commandName}`); // Log do comando detectado

    const { commandName, options, member } = interaction;

    if (commandName === 'cargo') {
        const subcommand = options.getSubcommand();
        const roleKey = options.getString('role');
        const target = options.getMember('user') || member; // Se não especificado, aplica ao próprio usuário

        console.log(`Subcomando: ${subcommand}`);
        console.log(`Cargo solicitado: ${roleKey}`);
        console.log(`Usuário alvo: ${target.user.tag}`);

        try {
            switch (subcommand) {
                case 'list':
                    console.log('Listando cargos...');
                    await listRoles(interaction);
                    break;
                case 'help':
                    console.log('Exibindo ajuda...');
                    await interaction.reply('Comandos disponíveis: /cargo [role], /cargo list, /cargo help');
                    break;
                default:
                    if (roleKey) {
                        console.log(`Verificando cargo: ${roleKey}`);
                        if (rolesMap[roleKey]) {
                            if (roleKey === 'admin' || roleKey.includes('-mod')) {
                                // Verifica se o membro tem permissões para dar cargos admin/mod
                                console.log('Verificando permissões do membro...');
                                if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                    console.log('Permissão encontrada, atribuindo cargo...');
                                    await manageRole(interaction, target, rolesMap[roleKey], true);
                                } else {
                                    console.log('Permissões insuficientes.');
                                    await interaction.reply('Você não tem permissão para usar este comando.');
                                }
                            } else {
                                console.log('Atribuindo cargo...');
                                await manageRole(interaction, target, rolesMap[roleKey], false);
                            }
                        } else {
                            console.log('Cargo não reconhecido.');
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
    console.log(`Tentando atribuir o cargo: ${roleName} ao usuário: ${target.user.tag}`);

    try {
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            console.log(`Cargo ${roleName} não encontrado.`);
            await interaction.reply(`Cargo "${roleName}" não encontrado.`);
            return;
        }

        console.log(`Cargo encontrado: ${role.name}`);

        if (temporary && roleName === process.env.ROLE_ADMIN) {
            // Aplica o cargo temporariamente
            console.log(`Atribuindo cargo temporário por ${process.env.TIME_ROLE} minutos...`);
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName} por ${process.env.TIME_ROLE} minutos.`);
            setTimeout(async () => {
                console.log(`Removendo o cargo ${roleName} após ${process.env.TIME_ROLE} minutos.`);
                await target.roles.remove(role);
                interaction.followUp(`${target.user.tag} teve o cargo ${roleName} removido após ${process.env.TIME_ROLE} minutos.`);
            }, parseInt(process.env.TIME_ROLE) * 60000);
        } else {
            // Aplica o cargo permanentemente
            console.log(`Atribuindo cargo permanentemente...`);
            await target.roles.add(role);
            await interaction.reply(`${target.user.tag} agora tem o cargo ${roleName}.`);
        }
    } catch (error) {
        console.error('Erro ao adicionar cargo:', error);
        await interaction.reply('Não foi possível adicionar o cargo.');
    }
}

async function listRoles(interaction) {
    console.log('Listando todos os cargos...');
    const rolesString = interaction.guild.roles.cache
        .filter(role => Object.values(rolesMap).includes(role.name))
        .map(role => `${role.name}: ${role.members.size} membros`)
        .join('\n');
    await interaction.reply(`Cargos disponíveis e suas contagens:\n${rolesString}`);
}

module.exports = { handleCommand };
