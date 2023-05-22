const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription(`Crée un embed`)
    .addStringOption((option) =>
      option
        .setName("titre")
        .setDescription(`C’est le titre de l’embed`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(`Il s’agit de la description de l’embed (utiliser \\n pour créer des paragraphes)`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription(`C’est l’image pour le embed`)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("thumbnail")
        .setDescription(`C’est la vignette pour l’embed`)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription(`C’est le pied de page de l’embed`)
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("inline")
        .setDescription(`Si ce champ est en ligne?`)
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("fields")
        .setDescription(
          `Titres et valeurs des champs (format : titre1;valeur1\\nveParagraph2,titre2;valeur2)`
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("couleur")
        .setDescription("Sélectionnez une couleur d’intégration Discord.js 14 disponible")
        .setRequired(false)
        .addChoices(
          { name: 'Default', value: 'Default' },
          { name: 'Aqua', value: 'Aqua' },
          { name: 'DarkAqua', value: 'DarkAqua' },
          { name: 'Green', value: 'Green' },
          { name: 'DarkGreen', value: 'DarkGreen' },
          { name: 'Blue', value: 'Blue' },
          { name: 'DarkBlue', value: 'DarkBlue' },
          { name: 'Purple', value: 'Purple' },
          { name: 'DarkPurple', value: 'DarkPurple' },
          { name: 'LuminousVividPink', value: 'LuminousVividPink' },
          { name: 'DarkVividPink', value: 'DarkVividPink' },
          { name: 'Gold', value: 'Gold' },
          { name: 'DarkGold', value: 'DarkGold' },
          { name: 'Orange', value: 'Orange' },
          { name: 'DarkOrange', value: 'DarkOrange' },
          { name: 'Red', value: 'Red' },
          { name: 'DarkRed', value: 'DarkRed' },
          { name: 'Grey', value: 'Grey' },
          { name: 'DarkGrey', value: 'DarkGrey' },
          { name: 'DarkerGrey', value: 'DarkerGrey' },
          { name: 'LightGrey', value: 'LightGrey' },
          { name: 'Navy', value: 'Navy' },
          { name: 'DarkNavy', value: 'DarkNavy' },
          { name: 'Yellow', value: 'Yellow' }
       
    )),

  async execute(interaction) {
    const { options } = interaction;

    const title = options.getString("titre");
    const description = options.getString("description").replace(/\\n/g, "\n");
    const image = options.getString("image");
    const thumbnail = options.getString("thumbnail");
    const footer = options.getString("footer") || " ";
    const color = interaction.options.getString("couleur");

    let fields = [];

    const fieldsOption = options.getString("fields");
    if (fieldsOption) {
      const fieldPairs = fieldsOption.split(",");
      for (const fieldPair of fieldPairs) {
        const [fieldName, fieldValue] = fieldPair.split(";");
        fields.push({
          name: fieldName,
          value: fieldValue.replace(/\\n/g, "\n"),
          inline: options.getBoolean("inline") || false,
        });
      }
    }

    if (image) {
      if (!image.startsWith("http"))
        return await interaction.reply({
          content: "Vous ne pouvez pas en faire votre image",
          ephemeral: true,
        });
    }

    if (thumbnail) {
      if (!thumbnail.startsWith("http"))
        return await interaction.reply({
          content: "Vous ne pouvez pas en faire votre miniature",
          ephemeral: true,
        });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setImage(image)
      .setThumbnail(thumbnail)
      .addFields(fields)
      .setFooter({
        text: `${footer}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
      });

    await interaction.reply({
      content: "Votre embed a été créé",
      ephemeral: true,
    });

    await interaction.channel.send({ embeds: [embed] });
  },
};