const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fetch = require("node-fetch")
const ms = require('ms');
const bans = require('../../Schemas/bans.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban-temporaire')
    .setDMPermission(false)
    .setDescription('Bannit l’utilisateur spécifié.')
    .addUserOption(option => option.setName('membre').setDescription('Spécifiez l’utilisateur à bannir.').setRequired(true))
    .addStringOption(option => option.setName('temps').setDescription(`Quantité de temps spécifiée sera le temps de l’interdiction.`))
    .addStringOption(option => option.setName('raison').setDescription('Raison pour laquelle vous voulez interdire l’utilisateur spécifié.').setRequired(false)),
    async execute(interaction, client) {
 
        const users = interaction.options.getUser('membre');
        const ID = users.id;
        const banUser = client.users.cache.get(ID);
        const banmember = interaction.options.getMember('membre');
        const optiontime = interaction.options.getString('temps');
 
        let time = ``;
        if (!optiontime) {
            time = `notime`;
        } else {
            time = ms(optiontime);
        }
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: 'Tu **ne peux** pas utiliser le bannissement sur toi..', ephemeral: true});
        if (!banmember) return await interaction.reply({ content: `Cet utilisateur **n’existe pas** dans votre serveur.`, ephemeral: true});
 
        let reason = interaction.options.getString('raison');
        if (!reason) reason = 'Aucune raison fournie :('
 
        const dmembed = new EmbedBuilder()
        .setColor("#af00fe")
        .setAuthor({ name: '🔨 Outil d’interdiction'})
        .setTitle(`> On vous a interdit "${interaction.guild.name}"`)
        .addFields({ name: '• serveur', value: `> ${interaction.guild.name}`, inline: true})
        .addFields({ name: '• raison', value: `> ${reason}`, inline: true})
        .setFooter({ text: '🔨 Le marteau d’interdiction frappe à nouveau'})
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
 
        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setAuthor({ name: '🔨 Outil d’interdiction'})
        .setTitle(`> L’utilisateur a été banni!`)
        .addFields({ name: '• Membre', value: `> ${banUser.tag}`, inline: true})
        .addFields({ name: '• Raison', value: `> ${reason}`, inline: true})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setFooter({ text: '🔨 Le marteau d’interdiction frappe à nouveau'})
        .setTimestamp()
 
        if (time !== 'notime') {
            embed.addFields({ name: `• Time`, value: `> <t:${Math.floor(Date.now()/1000 + time/1000)}:R>`})
            dmembed.addFields({ name: `• Time`, value: `> <t:${Math.floor(Date.now()/1000 + time/1000)}:R>`})
        }
 
        try {
            await interaction.guild.bans.create(banUser.id, {reason})
        } catch {
            return interaction.reply({ content: `**Impossible** d’interdire ce membre! Vérifiez mon **poste** et réessayez.`, ephemeral: true})
        }
 
        await banUser.send({ embeds: [dmembed] }).catch();
        await interaction.reply({ embeds: [embed] });
 
        if (time === 'notime') return;
        else {
            const settime = Date.now() + time;
            await bans.create({
                Guild: interaction.guild.id,
                User: banUser.id,
                Time: settime
            })
        }
    }
}