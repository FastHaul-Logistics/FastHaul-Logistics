const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require(`discord.js`);
const memberJoin = require('../../Schemas/memberJoin.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('informations-membre')
    .setDescription('Configurer le système d’adhésion des membres')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command.setName('gérer').setDescription('Configurer le système d’adhésion des membres')
    .addChannelOption(option => option.setName('salon').setDescription('Le canal auquel les journaux doivent être envoyés').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(command => command.setName('désactiver').setDescription('Désactiver le système d’adhésion'))
    .addSubcommand(command => command.setName('éditer').setDescription('Changer le canal auquel les journaux doivent être envoyés')
    .addChannelOption(option => option.setName('salon').setDescription('Le canal auquel les journaux doivent être envoyés').addChannelTypes(ChannelType.GuildText).setRequired(true))),
    async execute (interaction) {

        if (!interaction.guild) return await interaction.reply({ content: "Cette commande n’est utilisable que sur le serveur!", ephemeral: true });

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'setup':

            const setupData = await memberJoin.findOne({ Guild: interaction.guild.id});

            const setupChannel = interaction.options.getChannel('salon')
    
            if (setupData) return await interaction.reply({ content: 'Vous avez déjà configuré le système logs', ephemeral: true });
            else {
                await memberJoin.create({
                    Guild: interaction.guild.id,
                    Channel: setupChannel.id,
                })
    
                const embed = new EmbedBuilder()
                .setColor('#c5ae00')
                .setDescription(`:white_check_mark:  Le système de journaux a été configuré pour ${setupChannel}!`)
    
                await interaction.reply({ embeds: [embed] })
            }

            break;

            case 'disable':

            const Data = await memberJoin.findOne({ Guild: interaction.guild.id});

            if (!Data) return await interaction.reply({ content: 'Le système de journaux n’est pas configuré!', ephemeral: true });
            else {
                await memberJoin.deleteMany({ Guild: interaction.guild.id});
    
                const embed = new EmbedBuilder()
                .setColor('#c5ae00')
                .setDescription(`:white_check_mark:  Le système de journaux a été désactivé.`)
    
                await interaction.reply({ embeds: [embed] })
            }

            break;

            case 'edit':

            const data = await memberJoin.findOne({ Guild: interaction.guild.id});

            const channel = interaction.options.getChannel('salon')
    
            if (!data) return await interaction.reply({ content: 'Vous n’avez pas configuré le système de connexion du membre dans le serveur!', ephemeral: true});
            else {
                await memberJoin.deleteMany();
    
                await memberJoin.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                })
    
            const embed3 = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark:  Vous avez changé le canal des journaux en ${channel}!`)
    
            await interaction.reply({ embeds: [embed3]});
        }
        }
    }

}