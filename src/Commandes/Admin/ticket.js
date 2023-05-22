const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
  const TicketSetup = require('../../Schemas/TicketSetup.js');
  const config = require('../../config');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Une commande pour configurer le système de ticket.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
        option
          .setName('salon')
          .setDescription('Sélectionnez le canal où les tickets doivent être créés.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName('catégorie')
          .setDescription('Sélectionnez le parent où les tickets doivent être créés.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildCategory)
      )
      .addChannelOption((option) =>
        option
          .setName('transcripts')
          .setDescription('Sélectionnez le canal où les transcriptions doivent être envoyées.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addRoleOption((option) =>
        option
          .setName('handlers')
          .setDescription('Sélectionner le rôle des gestionnaires de tickets.')
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName('everyone')
          .setDescription('Sélectionner le rôle everyone.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('Choisir une description pour l’intégration du ticket.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('boutton')
          .setDescription('Choisir un nom pour l’intégration du ticket.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('Choisissez un style, alors choisissez un emoji.')
          .setRequired(true)
      ),
    async execute(interaction) {
      const { guild, options } = interaction;
      try {
        const channel = options.getChannel('salon');
        const category = options.getChannel('catégorie');
        const transcripts = options.getChannel('transcripts');
        const handlers = options.getRole('handlers');
        const everyone = options.getRole('everyone');
        const description = options.getString('description');
        const button = options.getString('boutton');
        const emoji = options.getString('emoji');
        await TicketSetup.findOneAndUpdate(
          { GuildID: guild.id },
          {
            Channel: channel.id,
            Category: category.id,
            Transcripts: transcripts.id,
            Handlers: handlers.id,
            Everyone: everyone.id,
            Description: description,
            Button: button,
            Emoji: emoji,
          },
          {
            new: true,
            upsert: true,
          }
        );
        const embed = new EmbedBuilder().setDescription(description);
        const buttonshow = new ButtonBuilder()
          .setCustomId(button)
          .setLabel(button)
          .setEmoji(emoji)
          .setStyle(ButtonStyle.Primary);
        await guild.channels.cache.get(channel.id).send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(buttonshow)],
        }).catch(error => {return});
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Le panneau de ticket a été créé avec succès.').setColor('Green')], ephemeral: true});
      } catch (err) {
        console.log(err);
        const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
        return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
      }
    },
  };