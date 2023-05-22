const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
 
 
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('expulser')
    .setDescription('Exclure un membre')
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Quel membre souhaitez-vous expluser ?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Pour quelle raison souhaitez-vous exclure ce membre ?')
        .setRequired(false)),
  async execute(interaction) { 
    const target = interaction.options.getUser('user');
    const user = await interaction.guild.members.fetch(target.id);
    const reason = interaction.options.getString('reason') || 'No Reason Provided';
    let guild = await interaction.guild.fetch();
    const unableEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(`<a:coolmoving:1037089557889421363> Unable to send a DM to ${target.tag}. <a:coolmoving:1037089557889421363>`)
      .setTimestamp();
    const dmEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Sanction')
      .setDescription(`Vous denez d'être expulsé de ${guild.name} !\` \n \n \n **Raison :** \n > ${reason} \n \n **Modérateur :** \n ${interaction.user.tag}`)
      .setTimestamp();
    const permEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(`:x: Tu n'a pas la permissions d'utilisez cette commande ! :x:`)
      .setTimestamp();
    const kickEmbed = new EmbedBuilder()
      .setColor(0x05fc2a)
      .setTitle('Sanction')
      .setDescription(`Le membre **${target.tag}** a été **kick**
      > Raison : **${reason}**`)
      .setTimestamp();
    const failkickEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(`❌ Ce membre est introuvable sur le serveur, veuillez réessayer !`)
      .setTimestamp();
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return await interaction.channel.sendTyping(),
        await interaction.reply({ embeds: [permEmbed], ephemeral: true });
    if (!user.kickable)
      return await interaction.channel.sendTyping(),
        await interaction.reply({ embeds: [failkickEmbed], ephemeral: true });
 
    await target.send({ embeds: [dmEmbed] }).catch((err) => { return console.log('Failed to DM user.') });
 
    let kick = await guild.members.kick(target, `${interaction.user.tag} - ${reason}`).catch((err) => { console.log("Error with Kick command: " + err) })
    if (kick) {
      await interaction.channel.sendTyping(),
        await interaction.reply({ embeds: [kickEmbed] })
    } else if (!kick) {
      await interaction.channel.sendTyping(),
      interaction.reply({ embeds: [failkickEmbed] })
    }
  }
}