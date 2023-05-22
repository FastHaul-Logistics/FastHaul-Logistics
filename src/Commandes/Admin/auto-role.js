const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const roleschema = require('../../Schemas/autorole.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('auto-role')
    .setDMPermission(false)
    .setDescription('Configurer un rôle automatique qui est donné à vos membres lors de l’adhésion.')
    .addSubcommand(command => command.setName('définir').setDescription('Définir votre rôle automatique.').addRoleOption(option => option.setName('role').setDescription('Specified role will be your auto-role.').setRequired(true)))
    .addSubcommand(command => command.setName('supprimer').setDescription('Supprime votre rôle automatique.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && interaction.user.id !== '619944734776885276') return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'définir':
 
            const role = interaction.options.getRole('rôle');
 
            const roledata = await roleschema.findOne({ Guild: interaction.guild.id });
            if (roledata) return await interaction.reply({ content: `Vous **déjà** avez établi un rôle automatique! (<@&${roledata.Role}>)`, ephemeral: true})
            else {
 
            await roleschema.create({
                Guild: interaction.guild.id,
                Role: role.id
            })
 
            const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle('> Le rôle automatique a été \n> défini avec succès!')
            .setAuthor({ name: `⚙️ Outil de rôle automatique`})
            .setFooter({ text: `⚙️ Faire /auto-role remove à défaire`})
            .setThumbnail('https://imgur.com/DQAfUSF.png')
            .addFields({ name: `• Le rôle automatique a été établi`, value: `> Le nouveau rôle automatique est ${role}`})
 
            await interaction.reply({ embeds: [embed]});
        }
 
        break;
            case 'supprimer':
 
            const removedata = await roleschema.findOne({ Guild: interaction.guild.id });
            if (!removedata) return await interaction.reply({ content: `Vous **n’avez pas** de rôle établi automatiquement! **Impossible** de supprimer **rien**..`, ephemeral: true})
            else {
 
                await roleschema.deleteMany({
                    Guild: interaction.guild.id
                })
 
                const embed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle('> Le rôle automatique a été \n> correctement désactivé!')
                .setAuthor({ name: `⚙️ Outil de rôle automatique`})
                .setFooter({ text: `⚙️ Faire /auto-role remove à défaire`})
                .setThumbnail('https://imgur.com/DQAfUSF.png')
                .addFields({ name: `• Le rôle automatique a été désactivé`, value: `> Vos membres ne recevront plus \n> votre rôle automatique`})
 
                await interaction.reply({ embeds: [embed]});
            }
        }
    }
}