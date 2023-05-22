const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js')
const publishschema = require('../../Schemas/autopublish.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('auto-publication')
    .setDescription('Configurer et désactiver votre système d’édition automatique')
    .addSubcommand(command => command.setName('ajouter-autpublication').setDescription('Ajouter un canal à la liste des canaux de l’éditeur automatique').addChannelOption(option => option.setName('channel').setDescription('the channel you want to auto publish').addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true)))
    .addSubcommand(command => command.setName('supprimer-autopublication').setDescription('Supprimer un canal de la liste des éditeurs automatiques').addChannelOption(option => option.setName('channel').setDescription('the channel you want remove from the list').addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true))),
    async execute (interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous n'avez pas la permission d'utiliser cette commande`, ephemeral: true})

        const sub = interaction.options.getSubcommand();
        const channel = await interaction.options.getChannel('salon');

        switch (sub) {

            case 'ajouter-autpublication':

            const data = await publishschema.findOne({ Guild: interaction.guild.id});

            const embed = new EmbedBuilder()
            .setColor('#c5ae00')
            .setDescription(`Tous les messages envoyés dans ${channel} seront publiés automatiquement !`)

            if (!data) {

                await interaction.reply({ embeds: [embed], ephemeral: true });

                await publishschema.create({
                    Guild: interaction.guild.id,
                    Channel: []
                })

                await publishschema.updateOne({ Guild: interaction.guild.id}, { $push: {Channel: channel.id}});
            } else {

                if (data.Channel.includes(channel.id)) return await interaction.reply({ content: `Le canal sélectionné a déjà été configuré pour la publication automatique`, ephemeral: true})

                await publishschema.updateOne({ Guild: interaction.guild.id}, { $push: {Channel: channel.id}});
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'supprimer-autopublication':

            const data1 = await publishschema.findOne({ Guild: interaction.guild.id});

            if (!data1) {
                return await interaction.reply({ content: `VOUS n’avez ajouté aucun canal au système d’édition !`, ephemeral: true});
            } else {

                if (data1.Channel.includes(channel.id)) return await IntegrationApplication.reply({ content: `Le canal sélectionné a déjà été configuré pour la publication automatique`, ephemeral: true})
                else {
                    const embed = new EmbedBuilder()
                    .setColor('#c5ae00')
                    .setDescription(`${channel} a été retiré de votre liste de publication automatique`)

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    await publishschema.updateOne({ Guild: interaction.guild.id}, { $pull: {Channel: channel.id}});
                }
            }
        }
    }
}