const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
 
module.exports = {
    //create the slash command
    data: new SlashCommandBuilder()
    .setName('ajoutée-rôle')
    .setDescription('Grants the user a role')
    .addUserOption(o => o.setName('membre').setDescription('The user, who you want to give a role to').setRequired(true))
    .addRoleOption(o => o.setName('rôle').setDescription('The role you want to give the user').setRequired(true)),
    async execute (interaction) {
        //get the variables
        const targetTag = interaction.options.getUser('membre').tag;
        const target = interaction.options.getMember('membre');
        const targetRole = interaction.options.getRole('rôle');
        
        //permission check, give an error if the member does not have the "Manage Roles" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('You do not have permission to do this.');
        //define the buttons
        
        
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirmer')
            .setStyle(ButtonStyle.Success);
        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Décliner')
            .setStyle(ButtonStyle.Danger);        
        const confirmed = new ButtonBuilder()
            .setCustomId('confirmed')
            .setLabel('Confirmer')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);
        const canceled = new ButtonBuilder()
            .setCustomId('canceled')
            .setLabel('Décliner')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
        const rowEnabled = new ActionRowBuilder()
        .addComponents(confirm, cancel)
        const rowDisabled = new ActionRowBuilder()
        .addComponents(confirmed, canceled)
        //define all of the embeds
        const embed = new EmbedBuilder()
        .setTitle('Role Grant Confirmation')
        .setColor("#af00fe")
        .setDescription(`Would you like to give ${targetTag} the ${targetRole} role?`)
        .setFooter({ text: "Are you sure?" })
        const embedConfirm = new EmbedBuilder()
        .setTitle('Role Grant Confirmed')
        .setColor("#af00fe")
        .setDescription(`Gave ${targetTag} the ${targetRole} role!`)
        .setFooter({ text: "Confirmed!" })
        const embedCancel = new EmbedBuilder()
        .setTitle('Role Grant Confirmation')
        .setColor("#af00fe")
        .setDescription(`Did not give ${targetTag} the ${targetRole} role.`)
        .setFooter({ text: "Canceled." })
        const embedErr = new EmbedBuilder()
        .setTitle('Error')
        .setColor("#af00fe")
        .setDescription('Something went wrong and I was unable to do the requested action.')
        //send the message
        const message = await interaction.reply({ embeds: [embed], components: [rowEnabled] })
        const collector = await message.createMessageComponentCollector()
        
        //execute some stuff when buttons are pressed
        collector.on('collect', async i => {
            if (i.customId == "confirm") {
                if (i.user.id !== interaction.user.id) return i.reply({ content: `This is ${interaction.user.tag}'s confirmation modal, not yours.'`})
                target.roles.add(targetRole).catch(err => {
                    console.error(err)
                    return i.update({ embeds: [embedErr], ephemeral: false, components: [rowDisabled] })
                })
                return i.update({ embeds: [embedConfirm], components: [rowDisabled] })
            }
            if (i.customId == "cancel") {
                if (i.user.id !== interaction.user.id) return await i.reply({ content: `This is ${interaction.user.tag}'s confirmation modal, not yours.'`})
                return i.update({ embeds: [embedCancel], components: [rowDisabled] })
            }
        })
}}