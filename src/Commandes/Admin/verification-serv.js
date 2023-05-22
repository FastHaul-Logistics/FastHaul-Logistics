const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const capschema = require('../../Schemas/verify.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('verification-serv')
    .setDMPermission(false)
    .setDescription('Configurez votre système de vérification en utilisant captcha.')
    .addSubcommand(command => command.setName('configuration').setDescription('Configurer le système de vérification pour vous.').addRoleOption(option => option.setName('role').setDescription('Specified role will be given to users who are verified.').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your verify channel').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)).addStringOption(option => option.setName('content').setDescription('Specified message will be included in the verification embed.').setRequired(false).setMinLength(1).setMaxLength(1000)))
    .addSubcommand(command => command.setName('désactiver').setDescription('Désactive votre système de vérification.')),
    async execute(interaction, client) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const data = await capschema.findOne({ Guild: interaction.guild.id });
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'setup':
 
            const role = await interaction.options.getRole('rôle');
            const channel = await interaction.options.getChannel('salon');
            const message = await interaction.options.getString('contenu') || 'Cliquer sur le bouton ci-dessous pour vérifier!';
 
            if (data) return await interaction.reply({ content: `Vous avez **déjà** un système de vérification **configuré**! \n> Faire **/verification-serv désactiver** pour annuler.`, ephemeral: true});
            else {
 
                await capschema.create({
                    Guild: interaction.guild.id,
                    Role: role.id,
                    Channel: channel.id,
                    Message: 'empty',
                    Verified: []
                })
 
                const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel('✅ vérifier')
                    .setStyle(ButtonStyle.Success)
                )
 
                const verify = new EmbedBuilder()
                .setColor('#c5ae00')
                .setThumbnail('https://imgur.com/DQAfUSF.png')
                .setTimestamp()
                .setTitle('• message de vérification')
                .setAuthor({ name: `✅ Procédure de vérification`})
                .setFooter({ text: `✅ message de vérification`})
                .setDescription(`> ${message}`)
 
                interaction.reply({ content: `Votre **système de vérification** a été configuré!`, ephemeral: true});
                const msg = await channel.send({ embeds: [verify], components: [buttons] });
 
                await capschema.updateOne({ Guild: interaction.guild.id }, { $set: { Message: msg.id }});
            }
 
            break;
            case 'disable':
 
            if (!data) return await interaction.reply({ content: `Le **système de vérification** n’a pas encore été **configuré** et ne peut rien supprimer **rien**..`, ephemeral: true});
            else {
 
                await capschema.deleteMany({ Guild: interaction.guild.id });
                const deletemsg = await client.channels.cache.get(data.Channel).messages.fetch(data.Message);
                await deletemsg.delete();
 
                await interaction.reply({ content: `Votre **système de vérification** a été **désactivé avec succès**!`, ephemeral: true});
 
            }
        }
    }
}