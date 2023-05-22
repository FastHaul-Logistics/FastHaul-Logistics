const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leave-guild")
    .setDescription("faire quitter le bot à un serveur")
    .addStringOption(option =>
      option.setName("guildid")
          .setDescription("guildid")
          .setRequired(true)
    ),
                   
                    async execute(interaction, client) {

                      if(interaction.member.id !== '1082828793447718952') return interaction.reply({ content: "Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!", ephemeral: true})

                      interaction.reply({content:'the bot has left this server', ephemeral: true})

                      const guildid = interaction.options.getString("guildid");

                      const guild = client.guilds.cache.get(guildid)

                      guild.leave().catch(() => {
                    return false;
                    });

                    }
}