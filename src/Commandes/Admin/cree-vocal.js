const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js')
const voiceSchema = require('../../Schemas/jointocreate.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`créer-vocal`)
    .setDescription('creer un canal vocal.')
    .addSubcommand(command => command.setName('configuration')
    .setDescription('Configurer votre connexion pour creer un canal vocal')
    .addChannelOption(option => option.setName('salon')
    .setDescription('Le canal que vous souhaitez rejoindre pour creer un canal vocal')
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildVoice))
    .addChannelOption(option => option.setName('catégorie')
    .setDescription('La catégorie du nouveau canal vocal à creer dans:')
    .setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    .addIntegerOption(option => option.setName('limite-vocal')
    .setDescription('Définir la limite par défaut du canal vocal')
    .setMinValue(2)
    .setMaxValue(10)))
    .addSubcommand(command => command.setName('désactiver')
    .setDescription('Désactive votre connexion pour créer un canal vocal')),
    async execute (interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.MANAGE_CHANNELS)) return await interaction.reply({ content: 'Vous n’avez pas les autorisations pour activer ce système', ephemeral: true})

        const data = await voiceSchema.findOne({ Guild: interaction.guild.id});
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'configuration':

            if (data) return await interaction.reply({ content: `Vous avez déjà une configuration join pour créer un système /cree-un-vocal disable pour le supprimer`, ephemeral: true})
            else {
                const channel = interaction.options.getChannel('salon')
                const category = interaction.options.getChannel('catégorie')
                const limit = interaction.options.getInteger('limite-vocal') || 3;

                await voiceSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Category: category.id,
                    VoiceLimit: limit
                });

                const embed = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`🔊 La connexion pour créer le système a été configurée dans ${channel}, tous les nouveaux canaux vocaux seront créés dans ${category}`)

                await interaction.reply({ embeds: [embed] })
            }

            break;
            case 'désactiver':
            
            if (data) return await interaction.reply({ content: `Vous avez déjà une configuration join pour créer un système /cree-un-vocal disable pour le supprimer`, ephemeral: true})
            else {

                const embed2 = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`🔊 Le systéme pour créer le système a bien été **désactivé**`)

                await voiceSchema.deleteMany({ Guild: interaction.guild.id});

                await interaction.reply({ embeds: [embed2] })
            }
        }
    }
}