const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, PermissionsBitField } = require('discord.js');
const { Schema } = require('mongoose');
const warnSchema = require('../../Schemas/warnSchema.js');
 
module.exports ={
    data: new SlashCommandBuilder()
    .setName('avertir')
    .setDescription('Avertir un membre.')
    .addSubcommand(command => command
        .setName('membre')
        .setDescription('Quel membre voulez-vous avertir ?')
        .addUserOption(option => option
            .setName('membre')
            .setDescription('Quel membre voulez-vous avertir ?')
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription('Pour quelle raison souhaitez-vous avertir ce membre ?')))
    .addSubcommand(command => command
        .setName('montrer')
        .setDescription('Afficher les avertissements d’un utilisateur.')
        .addUserOption(option => option
            .setName('avertit-utilisateur')
            .setDescription('L’utilisateur qui vous avertit que vous voulez voir.')))
    .addSubcommand(command => command
        .setName('supprimer')
        .setDescription('Supprimer l’avertissement d’un utilisateur.')
        .addUserOption(option => option
            .setName('supprimer-avertissement')
            .setDescription('L’utilisateur qui vous avertit que vous voulez supprimer.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('retiré-warn')
            .setDescription('L’avertissement que vous souhaitez supprimer de l’utilisateur sélectionné.')
            .setRequired(true))),
    async execute (interaction)
    {
 
        const command = interaction.options.getSubcommand()
 
        if (command === 'membre')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You need the Moderate Members permission to use this command.', ephemeral: true })
 
            const warnedUser = interaction.options.getUser('membre');
            const reason = interaction.options.getString('raison') || 'No reason given';
 
            if (warnedUser.bot) return await interaction.reply({ content: 'You cannot warn a bot.', ephemeral: true })
 
            let Data = await warnSchema.findOne({ UserID: interaction.options.getUser('membre').id, GuildID: interaction.guild.id })
 
            const unwarnedEmbed = new EmbedBuilder()
            .setTitle('Sanction')
            .addFields({ name: 'Avertissement!', value: `> Vous n’avez pas prévenu **${warnedUser}** avec la raison de **${reason}**.\n> \n> Vous avez annulé l’avertissement.` })
            .setColor('#af00fe')
 
            const warnedEmbed = new EmbedBuilder()
            .setTitle('Sanction')
            .addFields({ name: 'Avertissement!', value: `> Le membre **${warnedUser}** a été **averti**.
            > Raison: **${reason}**.` })
            .setColor('#af00fe')
 
            const warningEmbed = new EmbedBuilder()
            .setTitle('Sanction')
            .addFields({ name: 'Avertissement!', value: `> Vous allez avertir **${warnedUser}** avec la raison de **${reason}**.\n> \n> est-ce que vous confirmez?` })
            .setColor('#af00fe')
 
            const confirmButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirmer ?')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Décliner')
                    .setStyle(ButtonStyle.Danger),
                )
            var message = await interaction.reply({ embeds: [warningEmbed], components: [confirmButton] })
 
            const collector = message.createMessageComponentCollector()
 
            collector.on('collect', async i => {
 
                if (i.user.id != interaction.user.id) return await i.reply({ content: 'This isn\'t your command!', ephemeral: true })
 
                if (i.customId == 'confirm')
                {
 
                    if (!Data)
                    {
                        Data = new warnSchema({
                            UserID: warnedUser.id,
                            GuildID: interaction.guild.id,
                        })
 
                    }
 
                    await i.reply({ content: 'Confirmed!', ephemeral: true })
                    await interaction.editReply({ embeds: [warnedEmbed], components: [] })
                    Data.Warns.push(reason)
 
                    const dmEmbed = new EmbedBuilder()
                    .setTitle('Sanction')
                    .setDescription(`Vous venez de recevoir un avertissement sur **${interaction.guild.name}** **Raison** :
> ${reason}`)
                    .setColor('#af00fe')
                    await warnedUser.send({ embeds: [dmEmbed] }).catch(err => {
                        return;
                    })
 
                    await Data.save()
 
                }
                else {
 
                    await i.reply({ content: 'Declined!', ephemeral: true })
                    await interaction.editReply({ embeds: [unwarnedEmbed], components: [] })
 
                }
 
            })
 
        }
 
 
        if (command === 'montrer')
        {
 
            const warnsUser = interaction.options.getUser('membre') || interaction.user;
 
            let DataWarns = await warnSchema.findOne({ UserID: warnsUser.id, GuildID: interaction.guild.id })
 
            if ((!DataWarns || DataWarns.Warns.length == 0) && command === 'montrer')
            {
 
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('aucun avertissement!')
                .addFields({ name: '0 aveetissements!', value: `${warnsUser} n’a aucun avertissement!` })
                .setColor('#af00fe')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
 
            }
 
            else {
 
                let numberOfWarns1 = 0
                let numberOfWarns = 1
                let warns = ''
 
                for (i in DataWarns.Warns)
                {
 
                    warns += `**avertissement** **__${numberOfWarns}__**\n${DataWarns.Warns[numberOfWarns1]}\n\n`
 
                    numberOfWarns += 1
                    numberOfWarns1 += 1
 
                }
 
                const showWarnsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${warnsUser.username}'s | avertissements dans ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTitle('Sanction')
                .setDescription(warns)
                .setColor('#af00fe')
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
 
                await interaction.reply({ embeds: [showWarnsEmbed] })
 
            }
        }
 
        if (command === 'supprimer')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'Vous avez besoin de la permission des membres du staff pour utiliser cette commande.', ephemeral: true })
 
            removeWarnUser = interaction.options.getUser('supprimer-avertissement-utilisateur');
            warnRemoved = interaction.options.getInteger('retiré-warn')
            warnRemoved -= 1
 
            let DataUnwarned = await warnSchema.findOne({ UserID: interaction.options.getUser('remove-warn-user').id, GuildID: interaction.guild.id })
 
            if (!DataUnwarned || DataUnwarned.Warns.length == 0)
            {
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('No warnings!')
                .addFields({ name: '0 warnings!', value: `${removeWarnUser} n’a aucun avertissement à supprimer !` })
                .setColor('#af00fe')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
            }
 
            if (DataUnwarned.Warns[warnRemoved] == undefined)
            {
                const highWarnEmbed = new EmbedBuilder()
                .setTitle('Aucun avertissement trouvé!')
                .addFields({ name: 'Aucun avertissement trouvé!', value: `Vous n’avez pas précisé un avertissement qui se situe dans la plage de ${removeWarnUser}'s avertit.\nUtilisez \`/avertir montrer\` pour voir leurs avertissements.` })
                .setColor('#af00fe')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [highWarnEmbed] })
            }
 
 
            const removedWarnEmbed = new EmbedBuilder()
            .setTitle('Sanction')
            .addFields({ name: 'Avertissement supprimé!', value: `Vous avez supprimé l’avertissement de ${removeWarnUser} : **${DataUnwarned.Warns[warnRemoved]}**` })
            .setColor('#af00fe')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            const dmEmbed = new EmbedBuilder()
            .setTitle('Unwarned!')
            .addFields({ name: 'Tu as été unwarn!', value: `Vous avez été unwarn dans ${interaction.guild.name}!\nL’avertissement retiré était : ${DataUnwarned.Warns[warnRemoved]}` })
            .setColor('#af00fe')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            await removeWarnUser.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
            DataUnwarned.Warns.splice(DataUnwarned.Warns[warnRemoved], 1)
            DataUnwarned.save()
            return await interaction.reply({ embeds: [removedWarnEmbed] })
        }
 
    }
}