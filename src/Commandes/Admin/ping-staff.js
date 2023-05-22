const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const pingStaff = require('../../Schemas/pingstaff.js')

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping-staff')
    .setDescription('Ping en ligne des membres du personnel')
    .addSubcommand(command => command.setName('gestion-du-personnel').setDescription('Gérer le système ping staff').addRoleOption(option => option.setName('rôle').setDescription('Le rôle que vous voulez que les membres puissent mentionner').setRequired(true)))
    .addSubcommand(command => command.setName('staff').setDescription('Pings tous les membres du personnel en ligne avec un rôle').addRoleOption(option => option.setName('rôle').setDescription('Le rôle du personnel que vous souhaitez contacter').setRequired(true))),
    async execute (interaction) {

        const {options} = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'gestion-du-personnel':
                
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous n’avez pas de permanent pour gérer le système de ping staff`, ephemeral: true })
            else {
                const role = options.getRole('rôle');

                pingStaff.create({
                    Guild: interaction.guild.id,
                    RoleID: role.id,
                    RoleName: role.name
                })

                const embed = new EmbedBuilder()
                .setColor('#af00fe')
                .setDescription(`Le système ping staff a été configuré pour le rôle: ${role}`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'staff':

            const input = options.getRole('rôle')
            const id = input.id;
            const data = await pingStaff.findOne({ RoleID: id });
            if (!data) return await interaction.reply({ content: `Il semble que le système de ping n’ait pas été activé pour le rôle sélectionné`, ephemeral: true });
            else {

                if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: `Vous êtes sur un cooldown pour cette commande ! Réessayez plus tard`, ephemeral: true });

                const members = input.members.filter((member) => {
                    const status = member.presence?.status;
                    return ['online', 'idle', 'dnd'].includes(status);
                })

                if (members.size === 0) {
                    await interaction.reply({ content: `Il n’y a personne en ligne avec le rôle *${input}*... réessayer plus tard`, ephemeral: true });
                } else {
                    const memberList = members.map((member) => member.toString()).join('\n+ ');

                    const embed = new EmbedBuilder()
                    .setColor('#af00fe')
                    .setDescription('Pinger les membres pour vous aider! Ils devraient être avec vous bientôt')

                    await interaction.reply({ embeds: [embed], content: `\>\>\> **Alerte rôle ping du personnel!**\n\n + ${memberList}\n\n` });

                    timeout.push(interaction.user.id);
                    setTimeout(() => {
                        timeout.shift();
                    }, 60000);
                }
            }
        }
    }
}