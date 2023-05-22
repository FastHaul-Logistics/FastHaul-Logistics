const {
    SlashCommandBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChatInputCommandInteraction,
  } = require("discord.js");
  const fs = require("fs");
  const path = require("path");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("note")
      .setDescription("Write review about the bot")
      .addStringOption(option => option.setName('stars')
                  .setDescription('Select stars')
                  .addChoices(
                      {name: '⭐', value: '⭐'},
                      {name: '⭐⭐', value: '⭐⭐'},
                      {name: '⭐⭐⭐', value: '⭐⭐⭐'},
                      {name: '⭐⭐⭐⭐',  value: '⭐⭐⭐⭐'},
                      {name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐'}
                  )
                  .setRequired(true)
              ),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
  
    async execute(interaction) {
      const reactionstars = interaction.options.getString('stars')
  
      const reportmodal = new ModalBuilder()
        .setCustomId("modal")
        .setTitle("Report something about the bot");
  
      const question = new TextInputBuilder()
        .setCustomId("report")
        .setLabel("Report paragraph")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder("What do you want to report?");
  
      const action = new ActionRowBuilder().addComponents(question);
  
      reportmodal.addComponents(action);
  
      await interaction.showModal(reportmodal);
  
      try {
        const response = await interaction.awaitModalSubmit({ time: 300000 });
  
        const review = response.fields.getTextInputValue("report");
  
        const filePath = path.join(__dirname, "..", "..", "..", "review.txt");
  
        fs.appendFileSync(
          filePath,
          `{\n    "User": ${interaction.user.tag}\n    "Guild": ${interaction.guild.name}\n    "Stars": ${reactionstars}\n    "Review": ${review}\n}\n\n`
        );
  
        await response.reply({ content: "Review done", ephemeral: true });
  
        await interaction.user.send({embeds: [new EmbedBuilder()
                                          .setColor('Blue')
                                          .addFields(
                                              {name: 'Stars', value: `${reactionstars}`},
                                              {name: 'Review text', value: `${review}`}
                                          )
                                          ]}).catch(err => {
                                              return;
                                          })
  
      } catch (err) {
        await interaction.reply({
          content: "Something went wrong",
          ephemeral: true,
        });
      }
    },
  };