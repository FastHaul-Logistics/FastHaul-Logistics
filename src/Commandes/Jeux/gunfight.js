//with buttons
const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle,EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gunfight')
    .setDescription('Défier quelqu’un à un jeu de cowboy.')
    .addUserOption(option => option.setName('joueur').setDescription('Sélectionner un joueur à défier').setRequired(true)),
  async execute(interaction) {
    const player = interaction.options.getUser('joueur');
    if (player.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot challenge yourself!', ephemeral: true });
    }

    const acceptButton = new ButtonBuilder()
      .setCustomId('accept')
      .setLabel('accepter')
      .setStyle(ButtonStyle.Primary);

    const declineButton = new ButtonBuilder()
      .setCustomId('decline')
      .setLabel('refusé')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

    await interaction.reply({
      content: `${player}, vous avez été défié à un jeu de cowboy par ${interaction.user}! Voulez-vous accepter ce défi?`,
      components: [row],
    });

    const filter = i => i.user.id === player.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on('collect', async i => {
      if (i.customId === 'accept') {
        collector.stop('accepter');
        const words = ['shoot', 'draw', 'aim', 'reload', 'fire', 'bullets'];
        const word = words[Math.floor(Math.random() * words.length)];
        const delay = Math.floor(Math.random() * 5000) + 3000;

        const readyEmbed = new EmbedBuilder()
          .setTitle('être prêt!')
          .setDescription('Le jeu va commencer à tout moment.')
          .setImage('https://giffiles.alphacoders.com/102/102565.gif')
          .setColor('#ffa500');

        await interaction.followUp({ embeds: [readyEmbed] });

        await new Promise(resolve => setTimeout(resolve, delay));

        await interaction.followUp(`Le mot est **${word}**! TAPEZ MAINTENANT!`);

        const winnerFilter = m => m.content.toLowerCase() === word.toLowerCase();
        const winner = await interaction.channel.awaitMessages({ filter: winnerFilter, max: 1, time: 15000 });

        if (!winner.size) {
          await interaction.followUp(`Personne n’a tapé le mot à temps. C’est une égalité!`);
        } else {
          const winnerUser = winner.first().author;
          const winnerEmbed = new EmbedBuilder()
            .setTitle('félicitations!')
            .setImage('https://media.tenor.com/oDedOU2hfZcAAAAC/anime-cowboybebop.gif')
            .setDescription(`${winnerUser} won the cowboy game against ${interaction.user.id === winnerUser.id ? player : interaction.user}!`)
            .setColor('#00ff00');
          await interaction.followUp({ embeds: [winnerEmbed] });
        }
      } else if (i.customId === 'decline') {
        collector.stop('refusé');
        await interaction.followUp(`${player} refusé le défi. Peut-être la prochaine fois!`);
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        await interaction.followUp({

        content: `${player} n’a pas répondu à temps. Peut-être la prochaine fois!`,

        components: [],

      });

    }

  });

}
    }