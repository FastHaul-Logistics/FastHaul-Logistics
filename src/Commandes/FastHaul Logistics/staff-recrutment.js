const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('staff-recrutment')
    .setDescription('Envoie le formulaire de recrutement/Send in the recruitment form.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        const botDeveloperId = '1082011193247539240';
        if (userId !== botDeveloperId) {
          return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
        }
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
        const embed = new EmbedBuilder()
        .setColor('#af00fe')
        .setDescription(`Bien le bonjour à tous et toute, aujourd'hui nous faisons un recrutement staff, nous cherchons pour cela divers membres qui voudront faire les postes suivants:
        Hello everyone and all, today we are recruiting staff, we are looking for various members who will want to do the following positions:`)
        .addFields({ name: "[FH.L]-Human Ressource Team", value: "Vous vous occuperez des recrutements/You’ll do the recruiting." })
        .addFields({ name: "[FH.L]-Event Team", value: "Vous vous occuperez des invitations de convois/You’ll handle the convoy invitations."})
        .addFields({ name: '[FH.L]-Streamer', value: "Vous serez un streamer officiel de l'entreprise/You will be an official streamer of the company."})
        .addFields({ name: '[FH.L] Graphiste', value: "Vous serez le graphiste de l'entreprise/You will be the graphic designer of the company."})
        .addFields({ name: "Si un poste vous intéresse, merci d'ouvrir un ticket ou de MP <@1082828793447718952>", value: "If you are interested in a position, please open a ticket or PM <@1082828793447718952>"})
        .setImage('https://imgur.com/DQAfUSF.png')
        
        await interaction.reply({ embeds: [embed] })
    }
}