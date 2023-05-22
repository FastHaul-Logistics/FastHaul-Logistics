const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('annonce')
        .setDescription('Envoyer une annonce à un canal spécifique')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('salon').setDescription('Le canal où vous voulez qu’il aille').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addRoleOption(option => option.setName('rôle').setDescription('le rôle que vous souhaitez @').setRequired(true))
        .addStringOption(option => option.setName('titre').setDescription("Titre de l'embed").setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Contenu du message de l’annonce').setRequired(true))
        .addStringOption(option => option.setName('couleur').setDescription('Couleur de l’encastré (non requis)').setRequired(false))
        .addStringOption(option => option.setName('image').setDescription('Image de l’embed (non requise)').setRequired(false)),
    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel('salon');
        const role = options.getRole('rôle');
        const title = options.getString('titre');
        const message = options.getString('message');
        const colour = options.getString('couleur') || "DarkButNotBlack";
        const image = options.getString('image') || null;

        const embed = new EmbedBuilder()
            .setTitle(`📢 ${title} 📢`)
            .setColor(`${colour}`)
            .setDescription(`${message}`)
            .setImage(image)

        await channel.send({ embeds: [embed], content: `${role}` })
        await interaction.reply({ content: `Annonce envoyée à ${channel}`, ephemeral: true})
    }
}