const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const blacklist = require('../../Schemas/blacklist.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('blacklist')
  .setDescription('Blacklist a user from using this bot')
  .addSubcommand(command => command.setName('ajoutée').setDescription('Ajouter un utilisateur a la blacklist du bot').addStringOption(option => option.setName('membre').setDescription('The user ID you want to blacklist').setRequired(true)))
  .addSubcommand(command => command.setName('retiré').setDescription('Retiré un utilisateur de la blacklist du bot').addStringOption(option => option.setName('membre').setDescription('The user ID you want to blacklist').setRequired(true))),
  async execute (interaction) {
  
    const {options} = interaction;
    if (interaction.user.id !=='1082828793447718952') return await interaction.reply({ content: `Seuls **développeurs** peuvent utiliser cette commande !`, ephemeral: true });

    const user = options.getString('membre');
    const data = await blacklist.findOne({ User: user });
    const sub = options.getSubcommand();

    switch (sub) {
      case 'ajoutée':

      if (!data) {
        await blacklist.create({
          User: user,
        })

        const embed = new EmbedBuilder()
        .setColor('#c5ae00')
        .setDescription(`🛠 L’utilisateur \`${user}\` a été mis sur la liste noire de ce robot.`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else if (data) {
        return await interaction.reply({ content: `L’utilisateur \`${user}\` a déjà été **mis sur liste noire**`, ephemeral: true})
      }

      break;
      case 'retiré':

        if (!data) {
          return await interaction.reply({ content: `L’utilisateur \`${user}\` n’est pas sur la **liste noire**`, ephemeral: true })
        } else if (data) {
          await blacklist.deleteMany({ User: user });

          const embed = new EmbedBuilder()
        .setColor('#c5ae00')
        .setDescription(`🛠 L’utilisateur \`${user}\` a été retiré de la liste noire`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
  }

}