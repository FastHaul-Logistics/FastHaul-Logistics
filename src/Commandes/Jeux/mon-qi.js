const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mon-qi')
        .setDescription("Génère et fournit le QI de l’utilisateur"),
    async execute(interaction) {
        const minIQ = 20;
        const maxIQ = 200;
        const randomIQ = Math.floor(Math.random() * (maxIQ - minIQ + 1)) + minIQ;
        let message = `Votre QI est de: ${randomIQ}.`;

        if (randomIQ >= 80) {
            message = `Votre QI est élevé **${randomIQ}** Vous êtes un génie! 🧠`;
        } else if (randomIQ <= 50) {
            message = `Votre QI est faible **${randomIQ}** Continuez d’apprendre et de croître! 📚`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag} Résultat IQ`)
            .setDescription(message)
            .setColor('#c5ae00');

        await interaction.reply({ embeds: [embed] });
    },
};