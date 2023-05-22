const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Envoie les liens de recrutement/Send in the recruitment links.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
        const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setDescription(`Voici les liens pour pouvoir postuler chez nous, attentions ceci est obligatoire si vous êtes détenteur des deux plateformes:
        Here are the links to apply to us, please note that this is mandatory if you are a holder of both platforms:
        > TruckersMP: https://truckersmp.com/vtc/63085
        > Truckbooks: https://trucksbook.eu/company/174229`)
        .addFields({ name: ":flag_fr:Informations", value: "Pour entrer dans l'entreprise, vous devez postuler sur les deux liens obligatoirement." })
        .addFields({ name: ":flag_gb:Informations", value: "To enter the company, you must apply for both links."})
        .setImage('https://imgur.com/DQAfUSF.png')
        
        await interaction.reply({ embeds: [embed] })
    }
}