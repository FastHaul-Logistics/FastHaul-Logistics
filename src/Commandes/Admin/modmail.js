const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const modschema = require('../../Schemas/modmailSchema.js');
const moduses = require('../../Schemas/modmailUses.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Configurer votre système modmail.')
    .addSubcommand(command => command.setName('configuration').setDescription('Configurer votre système de modmail pour vous.').addChannelOption(option => option.setName('category').setDescription('Specified category will receive your modmails.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)))
    .addSubcommand(command => command.setName('désactiver').setDescription('Désactive le système modmail pour vous.'))
    .addSubcommand(command => command.setName('fermer').setDescription('Ferme votre modmail actuellement actif.')),
    async execute(interaction, client) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'configuration':
 
            if (!interaction.guild) return await interaction.reply({ content: `Vous **ne pouvez** utiliser cette commande dans vos **DMs**!`, ephemeral: true})
 
            const data1 = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
 
            if (data1) return await interaction.reply({ content: `Vous avez **déjà** configuré le **modmail** dans ce serveur. \n> Désactiver ***/modmail disable** pour annuler.`, ephemeral: true });
            else {
 
                const category = await interaction.options.getChannel('category');
 
                const setupembed = new EmbedBuilder()
                .setColor("#c5ae00")
                .setThumbnail('https://imgur.com/SqATnwm.png')
                .setAuthor({ name: `📞 Modmail System`})
                .setFooter({ text: `📞 Modmail Setup`})
                .setTimestamp()
                .setTitle('> Modmail activé')
                .addFields({ name: `• Modmail a été activé`, value: `> Vos membres pourront désormais vous contacter en m’envoyant un message direct!`})
                .addFields({ name: `• Catégorie`, value: `> ${category}`})
 
                await interaction.reply({ embeds: [setupembed] });
 
                await modschema.create({
                    Guild: interaction.guild.id,
                    Category: category.id
                })
            }
 
            break;
            case 'désactiver':
 
            if (!interaction.guild) return await interaction.reply({ content: `Vous **ne pouvez** utiliser cette commande dans **DMs**!`, ephemeral: true})
 
            const data = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Vous **n’avez** pas la permission de le faire!', ephemeral: true});
 
            if (!data) return await interaction.reply({ content: `Vous avez **pas** configuré le **modmail** dans ce serveur.`, ephemeral: true });
            else {
 
                const category = await interaction.options.getChannel('category');
 
                const setupembed = new EmbedBuilder()
                .setColor("#c5ae00")
                .setThumbnail('https://imgur.com/SqATnwm.png')
                .setAuthor({ name: `📞 Modmail Système`})
                .setFooter({ text: `📞 Modmail supprimé`})
                .setTimestamp()
                .setTitle('> Modmail désactivé')
                .addFields({ name: `• Modmail was Disabled`, value: `> Vos membres ne pourront plus vous contacter en m’envoyant un message direct.`})
 
                await interaction.reply({ embeds: [setupembed] });
                await modschema.deleteMany({ Guild: interaction.guild.id })
 
            }
 
            case 'fermer':
 
            const usedata = await moduses.findOne({ User: interaction.user.id });
 
            if (!usedata) return await interaction.reply({ content: `Vous n’avez **pas** de courriel ouvert ****!`, ephemeral: true});
            else {
 
                const channel = await client.channels.cache.get(usedata.Channel);
                if (!channel) {
 
                    await interaction.reply({ content: `Votre **modmail** a été **fermé**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });
 
                } else {
 
                    await interaction.reply({ content: `Votre **modmail** a été **fermé** dans **${channel.guild.name}**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });
                    await channel.send({ content: `⚠️ ${interaction.user} a **fermé** son **modmail**!`});
 
                }
            }
        }
    }
}