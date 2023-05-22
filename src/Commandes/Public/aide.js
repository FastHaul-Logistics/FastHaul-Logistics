const { SlashCommandBuilder, StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('aide')
    .setDescription('Get some help.'),
    async execute(interaction, client) {
 
        const helprow1 = new ActionRowBuilder()
        .addComponents(
 
            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('🏠Acceuil')
            .addOptions(
                {
                    label: '🏠Acceuil',
                    value: 'helpacceuil',
                  },
                  {
                    label: '🗂️Administrations',
                    description: 'Commande de la page: Administration.',
                    value: 'helpadmin',
                  },
    
                  {
                    label: 'ℹ️Informations',
                    description: 'Commande de la page: Informations.',
                    value: 'helpinfo'
                  },
    
                  {
                    label: '🛠️Modérations',
                    description: 'Commande de la page: Modérations.',
                    value: 'helpmod',
                  },
    
                  {
                    label: '👥Public',
                    description: 'Commande de la page: Public.',
                    value: 'helppublic',
                  },
            ),
        );
 
        const helpacceuil = new EmbedBuilder()
        .setColor('#af00fe')
        .setTitle('🏠Accueil')
        .setDescription(`-Utilisez </aide:1106243591501787186> pour afficher toutes les commandes.
        **Quelques liens utiles** :`)
        .setImage('https://imgur.com/DQAfUSF.png')
        
        await interaction.reply({ embeds: [helpacceuil], components: [helprow1] });
    }
}