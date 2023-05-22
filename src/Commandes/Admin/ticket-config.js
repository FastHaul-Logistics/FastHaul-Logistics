const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas/ticketSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-config')
        .setDescription('Configurer le système de ticket pour le serveur.')
        .addChannelOption(option => option.setName('channel')
        .setDescription('Le canal pour envoyer le panneau de ticket à').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => option.setName('category')
        .setDescription('La catégorie pour créer les chaînes de tickets dans').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        .addRoleOption(option => option.setName('role').setDescription('Le rôle de ping lorsqu’un ticket est créé').setRequired(true))
        .addChannelOption(option => option.setName('ticket-logs')
        .setDescription('Le canal pour les transcriptions à envoyer à').setRequired(true))
        .addStringOption(option => option.setName('description')
        .setDescription('La description du système de ticket').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('color')
        .setDescription('La couleur du panneau de ticket')
        .addChoices(
            { name: 'Red', value: 'Red' },
            { name: 'Blue', value: 'Blue' },
            { name: 'Green', value: 'Green' },
            { name: 'Yellow', value: 'Yellow' },
            { name: 'Purple', value: 'Purple' },
            { name: 'Pink', value: 'DarkVividPink' },
            { name: 'Orange', value: 'Orange' },
            { name: 'Black', value: 'NotQuiteBlack' },
            { name: 'White', value: 'White' },
            { name: 'Gray', value: 'Gray' },
            { name: 'Dark Blue', value: 'DarkBlue' },
            { name: 'Dark Red', value: 'DarkRed' },
        ).setRequired(true)),
 
 
    async execute(interaction, client) {
        try {
        const { options, guild } = interaction;
        const color = options.getString('color');
        const msg = options.getString('description');
        const thumbnail = interaction.guild.iconURL();
        const GuildID = interaction.guild.id;
        const panel = options.getChannel('channel');
        const category = options.getChannel('category');
        const role = options.getRole('role');
        const logs = options.getChannel('ticket-logs');
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
        }
 
        const data = await ticketSchema.findOne({ GuildID: GuildID });
        if (data) return await interaction.reply({ content: `Vous **déjà** avez un système de ticket configuré dans ce serveur!`, ephemeral: true});
 
        else {
            await ticketSchema.create({
                GuildID: GuildID,
                Channel: panel.id,
                Category: category.id,
                Role: role.id,
                Logs: logs.id,
            })
 
            const embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTimestamp()
            .setImage('https://imgur.com/DQAfUSF.png')
            .setTitle('> Panneau de tickets')
            .setAuthor({ name: `🎫 Système de tickets`})
            .setFooter({ text: `🎫 Configuration du panneau de billets`})
            .setDescription(`> ${msg} `)
            .setThumbnail(interaction.user.avatarURL())
 
            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('🎫 Create ticket')
                .setStyle(ButtonStyle.Success)
            )
 
            const channel = client.channels.cache.get(panel.id);
            await channel.send({ embeds: [embed], components: [button] });
 
            await interaction.reply({ content: `Le panneau de ticket a été envoyé à ${channel}`, ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    }
}
}