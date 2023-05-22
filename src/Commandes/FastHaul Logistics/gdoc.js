const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('recrutment-gdoc')
    .setDescription('Envoie le formulaire de recrutement/Send in the recruitment form.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
        const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setDescription(`Bien le bonjour cher postulant, merci de répondre au questionnaire sur le GDOC FastHaul Logistics:
        Hello dear applicant, thank you for answering the questionnaire on the GDOC FastHaul Logistics:
        > https://forms.gle/w1v1zqPM4a9MEPs87`)
        .addFields({ name: ":flag_fr:Informations", value: "Pour entrer dans l'entreprise, vous devez obligatoirement répondre au questionnaire." })
        .addFields({ name: ":flag_gb:Informations", value: "To enter the company, you must complete the questionnaire."})
        .setImage('https://imgur.com/DQAfUSF.png')
        
        await interaction.reply({ embeds: [embed] })
    }
}