const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription("Configuration du système d'automodération")
    .addSubcommand(command => command.setName('mots-marqués').setDescription('Bloquer mots grossiers, sexuelle, contenu, et les insultes'))
    .addSubcommand(command => command.setName('message-spammer').setDescription('Bloquer les messages soupçonnés de spammeurs potentiels'))
    .addSubcommand(command => command.setName('spam-mentions').setDescription('Messages de blocage contenant une certaine quantité de mentions').addIntegerOption(option => option.setName('nombre').setDescription('Le nombre de mentions nécessaires pour bloquer un message').setRequired(true)))
    .addSubcommand(command => command.setName('mot-clé').setDescription('Bloquer un mot clé donné dans le serveur').addStringOption(option => option.setName('word').setDescription('Le mot que vous voulez bloquer').setRequired(true))),
    async execute (interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You dont have permissions to setup automod within this server`, ephemeral: true });

        switch (sub) {
            case 'mots-marqués':

            await interaction.reply({ content: `Chargement de votre règle automod...`})

            const rule = await guild.autoModerationRules.create({
                name: 'Bloquer mots grossiers, sexuelle, contenu, et les insultes',
                creatorId: '1082011193247539240',
                enabmed: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                {
                    presets: [1, 2, 3]
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSecnds: 10,
                            customMessage: 'Ce message a été empêché par FastHaul Logistics.eu'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription('✔ Votre règle Automod a été créée- tous les jurons seront arrêtés par CrowBot')

                await interaction.editReply({ content: ``, embeds: [embed] });
            }, 3000)

            break;

            case 'message-spammer':

            await interaction.reply({ content: `Chargement de votre règle automod...`})
            const word = options.getString('word');

            const rule2 = await guild.autoModerationRules.create({
                name: `Empêcher le mot ${word} d’être utilisé par FastHaul Logistics.eu`,
                creatorId: '1082011193247539240',
                enabmed: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                {
                    keywordFilter: [`${word}`]
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSecnds: 10,
                            customMessage: 'Ce message a été empêché par FastHaul Logistics.eu'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`✔ Votre règle Automod a été créée- tous les messages contenant le mot ${word} seront supprimés`)

                await interaction.editReply({ content: ``, embeds: [embed2] });
            }, 3000)

            break;

            case 'spam-mentions':

            await interaction.reply({ content: `Chargement de votre règle automod...`})

            const rule3 = await guild.autoModerationRules.create({
                name: 'Prévenir les messages de spam par FastHaul Logistics.eu',
                creatorId: '1082011193247539240',
                enabmed: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                {
                    mentionTotalLimit: number
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSecnds: 10,
                            customMessage: 'Ce message a été empêché par FastHaul Logistics.eu'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`✔ Votre règle Automod a été créée- tous les messages contenant le mot ${word} seront supprimés`)

                await interaction.editReply({ content: ``, embeds: [embed3] });
            }, 3000)

            break;

            case 'mot-clé':

            await interaction.reply({ content: `Chargement de votre règle automod...`})
            const number = options.getInteger('number')

            const rule4 = await guild.autoModerationRules.create({
                name: 'Prévenir les mentions de spam par FastHaul Logistics.eu',
                creatorId: '1082011193247539240',
                enabmed: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                {
                    mentionTotalLimit: number
                },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'Ce message a été empêché par FastHaul Logistics.eu'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`✔ Votre règle Automod a été créée- tous les messages contenant le mot ${word} seront supprimés`)

                await interaction.editReply({ content: ``, embeds: [embed4] });
            }, 3000)
        }
    }
}