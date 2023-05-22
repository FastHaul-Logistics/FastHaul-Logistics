const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js')
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('guilds')
    .setDescription('Affiche tous les serveurs du bot.'),
  async execute(interaction, client) {
    if (interaction.user.id !== '1082828793447718952') {
      return interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!").then(e => {
        setTimeout(() => e.delete(), 4000);
      });
    }
    const guilds = client.guilds.cache.map(guild  => `\n${guild.name}(${guild.id}), ${guild.memberCount} Members.`);
    let memberCount = 0; 
    client.guilds.cache.forEach((guild) => {
      memberCount += guild.memberCount;
    });
    const embed = new EmbedBuilder()
      .setTitle(`${client.config.client.name} is in ${client.guilds.cache.size} Guilds`) //change the ${client.config.client.name} to your bot name
      .setDescription(`\`\`\`fix\nGuild List:\n${guilds}\`\`\``)
      .setColor('#c5ae00');
    await interaction.reply({ embeds: [embed] });
  },
};