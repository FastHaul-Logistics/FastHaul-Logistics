const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('owner')
    .setDescription("Afficher la liste des commandes pour l'owner du bot."),
    async execute (interaction, client) {
        const userId = interaction.user.id;
        const botDeveloperId = '1082828793447718952';
        if (userId !== botDeveloperId) {
          return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
        }
        const embed = new EmbedBuilder()
        .setColor('#c5ae00')
        .setTitle('🏠Accueil')
        .setDescription(`-Utilisez /owner pour afficher toutes les commandes.`)

        const embed2 = new EmbedBuilder()
        .setColor('#c5ae00')
        .setTitle('Voici ma liste de commande **OWNER**')
        .addFields({ name: '</blacklist add:1106169091787595777>, </blacklist remove:1106169091787595777>', value: "Liste noire ou supprimer des utilisateurs de la liste noire du bot,"})
        .addFields({ name: '</blping:1106169091787595778>', value: "Latence du bot pour la blacklist,"})
        .addFields({ name: '</testdabatase:1107029395660623983>', value: 'Test si la database est bien connecter,'})
        .addFields({ name: "</guilds:1106582725697220761>", value: "Affiche tous les serveurs du bot,"})
        .addFields({ name: '</leave-guild:1107262138365530203>', value: 'faire quitter le bot à un serveur,'})
        .addFields({ name: "</owner:1106279908839268505>", value: "Afficher la liste des commandes pour l'owner du bot."})
        .addFields({ name: "</restart:1106585373041250397>", value: "Arrête le bot. Seul le propriétaire du bot peut utiliser cette commande. Utiliser deux fois pour l’arrêt."})
        .addFields({ name: "</stats-bot:1106585681913978980>", value: "Statistiques du gestionnaire du bot,"})
        .addFields({ name: "</status-bot:1107908358045970534>", value: 'Définis le status du bot,'})
        .addFields({ name: "</uptime:1107238667157770272>", value: "Découvrez le temps de disponibilité des bots,"})
        .addFields({ name: "</verification:1107342904126607440>", value: "vérification."})
        .setImage('https://imgur.com/SqATnwm.png')
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setLabel('Menu')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setLabel('Owner')
            .setStyle(ButtonStyle.Danger)
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'page1') {

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} a utilisée le bouton !`, ephemeral: true})
                }
                await i.update({ embeds: [embed], components: [button] })
            }
        })

        collector.on('collect', async i => {
            if (i.customId === 'page2') {

                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} a utilisée le bouton !`, ephemeral: true})
                }
                await i.update({ embeds: [embed2], components: [button] })
            }
        })
    }
}