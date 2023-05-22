const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
 
 
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre.')
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('Quel membre ou utilisateur voulez-vous bannir ?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Pour quelle raison voulez-vous bannir cet utilisateur ?')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No Reason Provided';
    let guild = await interaction.guild.fetch();
    const permEmbed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setDescription(`:x: Tu n'a pas la permissions d'utilisez cette commande ! :x:`)
    .setTimestamp();
    const unableEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(`<a:coolmoving:1037089557889421363> Unable to send a DM to ${target.tag}. <a:coolmoving:1037089557889421363>`)
      .setTimestamp()
      .setFooter({ text: 'Bot made by AmNobCop' });
    const dmEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Sanction')
    .setDescription(`Vous denez d'être banni de ${guild.name} !\` \n \n \n **Raison :** \n > ${reason} \n \n **Modérateur :** \n ${interaction.user.tag}`)
    .setTimestamp();
    const banEmbed = new EmbedBuilder()
    .setColor(0x05fc2a)
    .setTitle('Sanction')
    .setDescription(`Le membre **${target.tag}** a été **banni**
    > Raison : **${reason}**`)
    .setTimestamp();
    const failbanEmbed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setDescription(`❌ Ce membre est introuvable sur le serveur, veuillez réessayer !`)
    .setTimestamp();
    const perm = interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers);
    if (!perm)
      return await interaction.channel.sendTyping(),
        interaction.reply({ embeds: [permEmbed], ephemeral: true });
 
    await target.send({ embeds: [dmEmbed] }).catch((err) => { return console.log('Failed to DM user.') });
 
    let ban = await guild.members.ban(target, { reason: `${interaction.user.tag} - ${reason}` }).catch((err) => { console.log("Error with Ban command: " + err) })
    if (ban) {
      await interaction.channel.sendTyping(),
        await interaction.reply({ embeds: [banEmbed] })
    } else if (!ban) {
      interaction.reply({ embeds: [failbanEmbed] })
    }
  }
}