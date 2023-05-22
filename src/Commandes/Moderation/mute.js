const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Réduire au silence un membre.')
    .addUserOption(option => option.setName('membre').setDescription('Réduire au silence un membre.').setRequired(true))
    .addStringOption(option => option.setName('temps').setRequired(true).setDescription('Combien de temps voulez-vous réduire au silence ce membre ?')
    .addChoices(
        { name: '60 Secondes', value: '60'},
        { name: '2 Minutes', value: '120'},
        { name: '5 Minutes', value: '300'},
        { name: '10 Minutes', value: '600'},
        { name: '15 Minutes', value: '900'},
        { name: '20 Minutes', value: '1200'},
        { name: '30 Minutes', value: '1800'},
        { name: '45 Minutes', value: '2700'},
        { name: '1 Heure', value: '3600'},
        { name: '2 Heures', value: '7200'},
        { name: '3 Heures', value: '10800'},
        { name: '5 Heures', value: '18000'},
        { name: '10 Heures', value: '36000'},
        { name: '1 jour', value: '86400'},
        { name: '2 jours', value: '172800'},
        { name: '3 jours', value: '259200'},
        { name: '5 jours', value: '432000'},
        { name: 'Une semaine', value: '604800'} ))
    .addStringOption(option => option.setName('raison').setDescription('Pour quelle raison voulez-vous réduire au silence ce membre ?').setRequired(true)),
    async execute(interaction, message, client) {
 
        const timeUser = interaction.options.getUser('membre');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const channel = interaction.channel;
        const duration = interaction.options.getString('temps');
        const user = interaction.options.getUser('user') || interaction.user;
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Vous n’avez pas la permission d’exécuter cette commande", ephemeral: true})
        if (!timeMember) return await interaction.reply({ content: 'L’utilisateur mentionné n’est plus dans le serveur.', ephemeral: true})
        if (!timeMember.kickable) return interaction.reply({ content: 'Je ne peux pas temporiser cet utilisateur!', ephemeral: true})
        if (!duration) return interaction.reply({content: 'Vous devez définir une durée valide pour le timeout', ephemeral: true})
        if (interaction.member.id === timeMember.id) return interaction.reply({content: "Vous ne pouvez pas vous mute vous-même!", ephemeral: true})
        if (timeMember.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply({content: "Vous ne pouvez pas interrompre le travail des membres du personnel ou des personnes avec la permission de mute les membres.", ephemeral: true})
 
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée."
 
        await timeMember.timeout(duration * 1000, reason)
 
            const minEmbed = new EmbedBuilder()
            .setColor('#c5ae00')
            .setTitle(`Sanction`)
            .setDescription(`Le membre **${timeUser.tag}** a été **Réduit au silence** ${duration / 60} minutes\n> Raison: ${reason}`)
 
 
            const dmEmbed = new EmbedBuilder()
            .setTitle('Sanction')
            .setDescription(`Vous venez d'être réduit au silence sur **${interaction.guild.name}**\n**Raison:**\n> ${reason}\n\n**Modérateur** : ${user.tag} \n**Fin de la sanction** : ${duration / 60} minutes`)
            .setColor('#c5ae00')
            .setTimestamp()
 
            await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
 
            await interaction.reply({ embeds: [minEmbed] })
 
 
 
    },
}