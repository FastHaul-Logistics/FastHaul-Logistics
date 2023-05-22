const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const weschema = require('../../Schemas/welcome.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('bienvenue-config')
    .setDMPermission(false)
    .setDescription("Configurer le canal d’accueil de votre serveur.")
    .addSubcommand(command => command.setName('définir').setDescription('Définit votre canal de bienvenue.').addChannelOption(option => option.setName('channel').setDescription('Le canal spécifié sera votre canal de bienvenue.').setRequired(true)))
    .addSubcommand(command => command.setName('retirer').setDescription('Supprime votre canal de bienvenue.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && interaction.user.id !== '619944734776885276') return await interaction.reply ({ content: "Vous **n’avez** pas la permission de le faire!", ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
        case 'set':
 
        const channel = interaction.options.getChannel('salon');
        const welcomedata = await weschema.findOne({ Guild: interaction.guild.id });
 
        if (welcomedata) return interaction.reply({ content: `Vous avez **déjà** un canal de bienvenue! (<#${welcomedata.Channel}>) \n> Faites **/welcome-channel remove** pour annuler.`, ephemeral: true})
        else {
 
            await weschema.create({
                Guild: interaction.guild.id,
                Channel: channel.id
            })
 
            const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Votre chaîne de bienvenue a \n> été réglé avec succès!`)
            .setAuthor({ name: `⚙️ Outil de bienvenue`})
            .setFooter({ text: `⚙️ Utilisez /bienvenue-config retirer pour annuler`})
            .setTimestamp()
            .setFields({ name: `• Canal était réglé`, value: `> Le canal ${channel} a été \n> définir comme votre canal de bienvenue.`, inline: false})
            .setThumbnail('https://imgur.com/DQAfUSF.png')
 
            await interaction.reply({ embeds: [embed] });
 
        }
 
        break;
 
        case 'remove':
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && interaction.user.id !== '619944734776885276') return await interaction.reply ({ content: "You **do not** have the permission to do that!", ephemeral: true});
 
        const weldata = await weschema.findOne({ Guild: interaction.guild.id });
        if (!weldata) return await interaction.reply({ content: `You **do not** have a welcome channel yet. \n> Do **/welcome-channel set** to set up one.`, ephemeral: true})
        else {
 
            await weschema.deleteMany({
                Guild: interaction.guild.id
            })
 
            const embed1 = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`> Votre canal de bienvenue a été supprimé avec succès!`)
            .setAuthor({ name: `⚙️ Outil de bienvenue`})
            .setFooter({ text: `⚙️ Utiliser /bienvenue-config définir pour régler votre chaîne`})
            .setTimestamp()
            .setFields({ name: `• Votre canal a été supprimé`, value: `> Le canal que vous avez précédemment défini \n> car votre chaîne de bienvenue ne sera plus \n> recevoir des mises à jour.`, inline: false})
            .setThumbnail('https://imgur.com/DQAfUSF.png')
 
            await interaction.reply({ embeds: [embed1] });
        }
        }
    } 
}