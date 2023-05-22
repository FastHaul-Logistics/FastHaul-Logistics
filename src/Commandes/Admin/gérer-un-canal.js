const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('gérer-un-canal')
    .setDescription('Créer ou supprimer un canal.')
    .addSubcommand(command => command.setName('créer').setDescription('Créer un canal avec un nom spécifié.')
        .addStringOption(option => option.setName('nom').setDescription(`Le nom spécifié sera le nom de votre chaîne.`).setRequired(true).setMinLength(1).setMaxLength(100))
        .addChannelOption(option => option.setName('catégorie').setDescription(`La catégorie spécifiée sera la catégorie parent de votre canal.`).setRequired(false).addChannelTypes(ChannelType.GuildCategory).setRequired(true))
        .addStringOption(option => option.setName('type').setDescription('Le type spécifié sera votre type de canal.').addChoices(
            { name: `salon textuel`, value: `text` },
            { name: `canal vocal`, value: `voice`},
            { name: `Stage Channel`, value: `stage` }, 
            { name: `canal d'annonce`, value: `announcement` },
            { name: `Canal Forum`, value: `forum` }
        ).setRequired(true)))
    .addSubcommand(command => command.setName('supprimer').setDescription('Supprime le canal spécifié.').addChannelOption(option => option.setName('canal').setDescription('Le canal spécifié sera supprimé.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildCategory, ChannelType.GuildStageVoice, ChannelType.GuildVoice, ChannelType.GuildText, ChannelType.GuildForum)))
    .addSubcommand(command => command.setName('éditer').setDescription('Supprime le canal spécifié.').addChannelOption(option => option.setName('canal').setDescription('Le canal spécifié sera modifié.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildStageVoice, ChannelType.GuildVoice, ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildCategory)).addStringOption(option => option.setName('new-name').setDescription(`Specified name will be your channel's new name.`).setMinLength(1).setMaxLength(100).setRequired(true))),
 
    async execute(interaction, err) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'créer':
 
            const name = await interaction.options.getString('nom');
            const category = await interaction.options.getChannel('catégorie');
            const type = await interaction.options.getString('type');
 
            if (type === 'text') {
 
                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                    parent: category.id
 
                }).catch(err => {
                    interaction.reply({ content: `**Impossible** de créer votre canal **${nom}**, veuillez vous assurer*** que j’ai l’autorisation **Gérer les canaux**!`})
                });
 
                const channelembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setAuthor({ name: `📃 Outil de canal`})
                .setFooter({ text: `📃 Canal créé`})
                .setTitle('> Canal créé')
                .addFields({ name: `• Canal créé`, value: `> Votre canal (${channel}) a été créé dans \n> la catégorie ${category}!`})
 
                await interaction.reply({ embeds: [channelembed]})
            }
 
            if (type === 'voice') {
 
                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildVoice,
                    parent: category.id
 
                }).catch(err => {
                    interaction.reply({ content: `**Impossible** de créer votre canal **${nom}**, veuillez vous assurer*** que j’ai l’autorisation **Gérer les canaux**!`})
                });
 
                const channelembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                .setAuthor({ name: `📃 Outil de canal`})
                .setFooter({ text: `📃 Canal créé`})
                .setTitle('> Canal créé')
                .addFields({ name: `• Canal créé`, value: `> Votre canal (${channel}) a été créé dans \n> la catégorie ${category}!`})
 
                await interaction.reply({ embeds: [channelembed]})
            }
 
            if (type === 'stage') {
 
                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildStageVoice,
                    parent: category.id
 
                }).catch(err => {
                    interaction.reply({ content: `**Impossible** de créer votre canal **${nom}**, veuillez vous assurer*** que j’ai l’autorisation **Gérer les canaux**!`})
                });
 
                const channelembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                .setAuthor({ name: `📃 Outil de canal`})
                .setFooter({ text: `📃 Canal créé`})
                .setTitle('> Canal créé')
                .addFields({ name: `• Canal créé`, value: `> Votre canal (${channel}) a été créé dans \n> la catégorie ${category}!`})
 
                await interaction.reply({ embeds: [channelembed]})
            }
 
            if (type === 'announcement') {
 
                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildAnnouncement,
                    parent: category.id
 
                }).catch(err => {
                    interaction.reply({ content: `**Impossible** de créer votre canal **${nom}**, veuillez vous assurer*** que j’ai l’autorisation **Gérer les canaux**!`})
                });
 
                const channelembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                .setAuthor({ name: `📃 Outil de canal`})
                .setFooter({ text: `📃 Canal créé`})
                .setTitle('> Canal créé')
                .addFields({ name: `• Canal créé`, value: `> Votre canal (${channel}) a été créé dans \n> la catégorie ${category}!`})
 
                await interaction.reply({ embeds: [channelembed]})
            }
 
            if (type === 'forum') {
 
                const channel = await interaction.guild.channels.create({
                    name: name,
                    type: ChannelType.GuildForum,
                    parent: category.id
 
                }).catch(err => {
                    interaction.reply({ content: `**Impossible** de créer votre canal **${nom}**, veuillez vous assurer*** que j’ai l’autorisation **Gérer les canaux**!`})
                });
 
                const channelembed = new EmbedBuilder()
                .setColor('#af00fe')
                .setTimestamp()
                .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
                .setAuthor({ name: `📃 Outil de canal`})
                .setFooter({ text: `📃 Canal créé`})
                .setTitle('> Canal créé')
                .addFields({ name: `• Canal créé`, value: `> Votre canal (${channel}) a été créé dans \n> la catégorie ${category}`})
 
                await interaction.reply({ embeds: [channelembed]})
            }
 
            break;
            case 'supprimer':
 
            const channel = await interaction.options.getChannel('channel');
            const channeldelete = await interaction.guild.channels.cache.get(channel.id);
 
            const embed = new EmbedBuilder()
            .setColor("#af00fe")
            .setTitle('> Canal supprimé')
            .setAuthor({ name: `📃 Outil de canal`})
            .setFooter({ text: `📃 Canal supprimé`})
            .addFields({ name: `• Canal supprimé`, value: `> Your channel (${channeldelete}) was deleted!`})
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
 
            await channeldelete.delete().catch(err => {
                return interaction.reply({ content: `**Impossible** de supprimer ce canal! Vérifiez mes **autorisations** et réessayez.`})
            });
 
            await interaction.reply({ embeds: [embed] });
 
            break;
            case 'éditer':
 
            const newname = await interaction.options.getString('new-name');
            const newchannel = await interaction.options.getChannel('channel');
            const updatedchannel = await interaction.guild.channels.cache.get(newchannel.id);
            const oldname = updatedchannel.name;
 
            const editembed = new EmbedBuilder()
            .setColor('#af00fe')
            .setAuthor({ name: `📃 Outil de canal`})
            .setFooter({ text: `📃 Canal modifié`})
            .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
            .setTimestamp()
            .addFields({ name: `• Canal modifié`, value: `> Nom du canal (${updatedchannel}) modifié \n> à partir de "**${oldname}**" => "**${newname}**".`})
 
            updatedchannel.setName(newname).catch(err => {
                interaction.reply({ content: `**Impossible** de modifier le nom de ${updatedchannel}. Vérifiez mes **autorisations** et réessayez.`});
            })
 
            await interaction.reply({ embeds: [editembed] });
        }
    }
}