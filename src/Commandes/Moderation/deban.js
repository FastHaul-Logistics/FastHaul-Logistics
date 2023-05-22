const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deban')
    .setDMPermission(false)
    .setDescription("Révoquer le bannissement d'un utilisateur.")
    .addUserOption(option => option.setName('membre').setDescription('Spécifiez l’utilisateur à bannir.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison pour laquelle vous souhaitez débloquer un utilisateur spécifié.').setRequired(false)),
    async execute(interaction, client) {
        
        const userID = interaction.options.getUser('membre');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        if (interaction.member.id === userID) return await interaction.reply({ content: "Tu **ne peux** pas utiliser l'unban sur toi.."});

        let reason = interaction.options.getString('raison');
        if (!reason) reason = 'Aucune raison fournie :('

        const embed = new EmbedBuilder()
        .setColor("#af00fe")
        .setAuthor({ name: '🔨 Outil d’interdiction'})
        .setTitle(`> L’utilisateur a été unban!`)
        .addFields({ name: '• membre', value: `> ${userID}`, inline: true})
        .addFields({ name: '• Raison', value: `> ${reason}`, inline: true})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081267701302972476/largered.png')
        .setFooter({ text: '🔨 The ban hammer missed'})

        await interaction.guild.bans.fetch() 
        .then(async bans => {

            if (bans.size == 0) return await interaction.reply({ content: 'Il n’y a **personne** à débloquer.', ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID ) return await interaction.reply({ content: 'Cet utilisateur **n’est pas** interdit.', ephemeral: true})

            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: `**Impossible** de débloquer un utilisateur spécifié!`, ephemeral: true})
            })
        })

        await interaction.reply({ embeds: [embed] });
    }
}