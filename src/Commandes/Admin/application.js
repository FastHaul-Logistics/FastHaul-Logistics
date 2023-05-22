const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
const axios = require('axios');
const staffSchema = require('../../Schemas/staffMessages.js');
 
module.exports = {
    category: "Developer",
    data: new SlashCommandBuilder()
    .setName('applications-setup')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Créer un système d’applications.')
    .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('Sélectionnez le canal auquel le panneau d’applications doit être envoyé.')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addChannelOption((option) =>
    option
      .setName('app-logs')
      .setDescription('Sélectionnez le canal où les demandes doivent être envoyées pour être examinées..')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Choisir une description pour l’intégration des applications.')
      .setRequired(true)
      .setMaxLength(1000)
  )
  .addStringOption((option) =>
    option
      .setName('button')
      .setDescription('Choisissez un nom pour les applications.')
      .setRequired(true)
      .setMaxLength(80)
  )
  .addStringOption((option) =>
    option
      .setName('emoji')
      .setDescription('Choisissez un style, alors choisissez un emoji.')
      .setRequired(true)
      )
      .addStringOption(option => option.setName('duration').setDescription('Sélectionnez la période pendant laquelle le membre ne peut pas postuler pour un poste.').setRequired(true).addChoices(
        { name: '60 Seconds', value: '60s' },
        { name: '2 Minutes', value: '2m' },
        { name: '5 Minutes', value: '5m' },
        { name: '10 Minutes', value: '10m' },
        { name: '15 Minutes', value: '15m' },
        { name: '20 Minutes', value: '20m' },
        { name: '30 Minutes', value: '30m' },
        { name: '45 Minutes', value: '45m' },
        { name: '1 Heure', value: '1h' },
        { name: '2 Heures', value: '2h' },
        { name: '3 Heures', value: '3h' },
        { name: '5 Heures', value: '5h' },
        { name: '10 Heures', value: '10h' },
        { name: '1 Jour', value: '1d' },
        { name: '2 Jours', value: '2d' },
        { name: '3 Jours', value: '3d' },
        { name: '5 Jours', value: '5d' },
        { name: 'Une semaine', value: '1w' },
        { name: 'Deux semaines', value: '2w' },
        { name: 'Trois semaines', value: '3w' },
        { name: 'Un mois', value: '30d' }
      ))
  .addStringOption((option) =>
    option
      .setName('question-1')
      .setDescription('Choisissez la première question pour la demande.')
      .setRequired(true)
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-2')
      .setDescription('Choisissez la deuxième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-3')
      .setDescription('Choisissez la troisième question pour la demande..')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-4')
      .setDescription('Choisissez la quatrième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-5')
      .setDescription('Choisissez la cinquième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-6')
      .setDescription('Choisissez la sixième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-7')
      .setDescription('Choisissez la septième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-8')
      .setDescription('Choisissez la huitième question pour la demande..')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-9')
      .setDescription('Choisissez la neuvième question pour la demande.')
      .setMaxLength(500)
    )
    .addStringOption((option) =>
    option
      .setName('question-10')
      .setDescription('Choisissez la dixième question pour la demande.')
      .setMaxLength(500)
    )
    .addRoleOption((option) =>
    option
      .setName('ping')
      .setDescription('Ajouter un ping pour le panneau.')
      )
    .addRoleOption((option) =>
    option
      .setName('moderator-role')
      .setDescription('Le rôle qui sera repéré lorsqu’une demande est envoyée.')
      ),
    async execute(interaction, client) {
 
        const { guild, options } = interaction;
 
            const channel = options.getChannel('channel');
            const transcripts = options.getChannel('app-logs');
            const description = options.getString('description');
            const button = options.getString('button');
            let emoji = options.getString('emoji')?.trim();
            const ping = options.getRole('ping');
            const modRole = options.getRole('moderator-role');
            const question1 = options.getString('question-1');
            const question2 = options.getString('question-2');
            const question3 = options.getString('question-3');
            const question4 = options.getString('question-4');
            const question5 = options.getString('question-5');
            const question6 = options.getString('question-6');
            const question7 = options.getString('question-7');
            const question8 = options.getString('question-8');
            const question9 = options.getString('question-9');
            const question10 = options.getString('question-10');
            const duration = options.getString('duration');
 
            async function isValidCustomEmoji(emoji) {
              if (emoji.startsWith("<") && emoji.endsWith(">")) {
                const id = emoji.match(/\d{15,}/g)[0];
            
                const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                  .then(image => {
                    if (image) return "gif"
                    else return "png"
                  }).catch(err => {
                    return "png"
                  })
            
                const emojiUrl = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
                return !!emojiUrl;
              } else {
                const emojiRegex = /[\p{Emoji_Presentation}\uFE0F]/u;
                return emojiRegex.test(emoji);
              }
            }
 
            const emojiRegex = /<a?:\w+:\d+>|[\p{Emoji_Presentation}\uFE0F]/gu;
            const emojis = emoji.match(emojiRegex);
            
            if (emojis && emojis.length > 1) {
              return interaction.reply({ content: 'Veuillez entrer un seul emoji.', ephemeral: true });
            }
            
            const isValid = await isValidCustomEmoji(emoji);
            if (!isValid) {
              return interaction.reply({ content: 'Veuillez saisir un emoji valide.', ephemeral: true });
            }
 
            const StaffSchema = await staffSchema.findOneAndUpdate(
                { GuildID: guild.id },
                {
                  Channel: channel.id,
                  Transcripts: transcripts.id,
                  Description: description,
                  Button: button,
                  Emoji: emoji,
                  Role: modRole,
                },
                {
                  new: true,
                  upsert: true,
                }
              );
 
              const StaffMessages = require('../../Schemas.js/staffMessages');
 
              const filter = { Guild: interaction.guild.id };
              const update = {
                Question1: question1,
                Question2: question2,
                Question3: question3,
                Question4: question4,
                Question5: question5,
                Question6: question6,
                Question7: question7,
                Question8: question8,
                Question9: question9,
                Question10: question10,
                Duration: duration
              };
              const questions = await StaffMessages.findOneAndUpdate(filter, update);
 
              if (questions) {
                await questions.save();
              } else {
                const newQuestions = await StaffMessages.create({
                  Guild: interaction.guild.id,
                  Question1: question1,
                  Question2: question2,
                  Question3: question3,
                  Question4: question4,
                  Question5: question5,
                  Question6: question6,
                  Question7: question7,
                  Question8: question8,
                  Question9: question9,
                  Question10: question10
                });
                await newQuestions.save();
              }
 
              await StaffSchema.save();
 
              const embed = new EmbedBuilder().setDescription(description);
              const buttonshow = new ButtonBuilder()
                .setCustomId('staffButton')
                .setLabel(button)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Primary);
                await guild.channels.cache.get(channel.id).send({
                  embeds: [embed],
                  content: ping ? `${ping}` : null,
                  components: [new ActionRowBuilder().addComponents(buttonshow)],
                }).catch(error => {return});
              return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Le panneau des applications a été créé avec succès.').setColor('Green')], ephemeral: true});
            
    }
}