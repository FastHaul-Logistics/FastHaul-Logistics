const { SlashCommandBuilder } = require('@discordjs/builders');
const Blacklist = require('../../Schemas/blacklistModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blping')
    .setDescription('Latence du bot pour la blacklist'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const botDeveloperId = '1082828793447718952';
    if (userId !== botDeveloperId) {
      return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
    }
    try {
      const blacklistedUser = await Blacklist.findOne({ userId });

      if (blacklistedUser) {
        return await interaction.reply('Vous êtes sur liste noire et ne pouvez pas utiliser les commandes.');
      }

      const reply = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const latency = reply.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(`Latence du Pong! Bot: ${latency}ms.`);
    } catch (error) {
      console.error('Erreur lors de la vérification de la liste noire:', error);
      await interaction.reply('Une erreur s’est produite lors de la vérification de l’état de votre liste noire.');
    }
  },
};