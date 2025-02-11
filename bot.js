require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommand } = require('./commands/cargo');
const { deployCommands } = require('./utils/deployCommands');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.on('error', error => {
    if (error.code === 'EAI_AGAIN') {
        console.log('⚠️ Problemas de conexão com o Discord. Tentando reconectar...');
        // Tenta reconectar após 5 segundos
        setTimeout(() => {
            client.login(process.env.MONGABOSS_DISCORD_TOKEN)
                .then(() => console.log('✅ Reconectado com sucesso!'))
                .catch(err => console.error('❌ Falha ao reconectar:', err));
        }, 5000);
    } else {
        console.error('Erro não esperado:', error);
    }
});

client.once('ready', () => {
    console.log(`Bot logado como ${client.user.tag}`);

    // Verifica se a variável MONGABOSS_DEPLOY_COMMANDS está configurada para 1
    if (process.env.MONGABOSS_DEPLOY_COMMANDS === '1') {
        deployCommands().then(() => {
            console.log('Comandos de Slash implantados.');
        }).catch((error) => {
            console.error('Erro ao implantar comandos:', error);
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    // Log inicial do comando
    if (interaction.isCommand()) {
        console.log(`👤 Usuário ${interaction.user.tag} solicitou o comando /${interaction.commandName}${
            interaction.options.getSubcommand(false) ? ` ${interaction.options.getSubcommand()}` : ''
        }`);
    } else {
        // Log para interações que não são comandos
        console.log(`⚠️ Interação não reconhecida de ${interaction.user.tag}: ${interaction.type}`);
        return;
    }
    
    if (!interaction.isCommand()) return;
    
    try {
        let isTimeout = false;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                isTimeout = true;
                reject(new Error('TIMEOUT'));
            }, 2500);
        });

        await Promise.race([
            handleCommand(interaction),
            timeoutPromise
        ]).then(() => {
            if (!isTimeout) {
                console.log(`✅ Comando /${interaction.commandName} ${interaction.options.getSubcommand()} executado com sucesso por ${interaction.user.tag}`);
            }
        }).catch(async (error) => {
            // Ignora erros específicos que indicam que a interação já foi respondida
            if (error.code !== 40060 && error.code !== 10062) {
                if (error.message === 'TIMEOUT') {
                    console.log(`⚠️ Timeout no comando /${interaction.commandName} ${interaction.options.getSubcommand()} solicitado por ${interaction.user.tag}`);
                } else if (error.code === 'EAI_AGAIN') {
                    console.log(`⚠️ Erro de conexão no comando /${interaction.commandName} ${interaction.options.getSubcommand()} solicitado por ${interaction.user.tag}`);
                } else {
                    console.error(`❌ Erro no comando /${interaction.commandName} ${interaction.options.getSubcommand()} solicitado por ${interaction.user.tag}:`, error);
                }
            }
        });
    } catch (error) {
        // Ignora erros já tratados
        if (error.code !== 40060 && error.code !== 10062) {
            console.error('Erro não tratado:', error);
        }
    }
});

// Adicione este handler para mensagens não comandos
client.on('messageCreate', message => {
    if (message.content.startsWith('/')) {
        console.log(`❌ Comando inválido detectado de ${message.author.tag}: ${message.content}`);
    }
});

process.on('unhandledRejection', error => {
    console.error('🚨 Unhandled promise rejection:', error);
});

client.login(process.env.MONGABOSS_DISCORD_TOKEN);
