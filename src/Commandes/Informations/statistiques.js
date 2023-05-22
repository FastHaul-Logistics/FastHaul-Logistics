const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const countingschema = require('../../Schemas/counting.js')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('statistiques')
    .setDescription('Configure le système de statistique du serveur.')
    .addSubcommand(command => command.setName('définir').setDescription('Configurer le système de comptage pour vous.').addChannelOption(option => option.setName('channel').setDescription('Le canal spécifié sera votre canal de comptage.').setRequired(true)))
    .addSubcommand(command => command.setName('désactiver').setDescription('Désactive le système de comptage de votre serveur.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous **n’avez** pas la permission de le faire!`, ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('salon');
        const data = await countingschema.findOne({ Guild: interaction.guild.id });
 
        switch (sub) {
 
            case 'setup':
 
            if (data) return await interaction.reply({ content: `Vous **déjà** avez un système de comptage configuré dans ce serveur!`, ephemeral: true})
            else {
 
                countingschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Count: 0
                })
 
                const embed = new EmbedBuilder()
                .setColor('#c5ae00')
                .setTimestamp()
                .setTitle('> Configuration du comptage')
                .setAuthor({ name: `🔢 Comptage système`})
                .setFooter({ text: `🔢 Le comptage a été établi`})
                .addFields({ name: `• configuration du système`, value: `> Votre canal (${channel}) a été configuré pour être \n> votre canal de comptage!`})
 
                await interaction.reply({ embeds: [embed]})
            }
 
            break;
 
            case 'disable':
 
            if (!data) return await interaction.reply({ content: `Aucun **système de comptage** trouvé, je ne peut rien supprimer..`, ephemeral: true})
            else {
 
                await countingschema.deleteMany();
                data.save();
 
                await interaction.reply({ content: `Votre **système de comptage** a été désactivé!`, ephemeral: true})
            }
        }
    }
}