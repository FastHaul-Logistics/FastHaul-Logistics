const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Afficher la liste des commandes.'),
    async execute (interaction, client) {

        const embed = new EmbedBuilder()
        .setColor('#c5ae00')
        .setTitle('🏠Accueil')
        .setDescription(`-Utilisez /aide pour afficher toutes les commandes.
        Clique sur le buton ci-dessous pour pouvoir m'inviter dans ton serveur discord.`)
        .setImage('https://imgur.com/DQAfUSF.png')
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setLabel('Invite moi')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1106144039109132329&permissions=8&scope=bot%20applications.commands')
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
    }
}