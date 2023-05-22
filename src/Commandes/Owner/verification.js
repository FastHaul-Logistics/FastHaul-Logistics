const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Emoji } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verification')
    .setDescription("vérification")

        .addStringOption(option =>
            option.setName('titre')
                .setDescription('Titre d’embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('description d’embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('coulour')
                .setDescription('Coulour d’embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('label')
                .setDescription('nom du bouton')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('rôle')
                .setRequired(true)
        ),

    async execute (interaction, client) {
        const userId = interaction.user.id;

        const botDeveloperId = '1082828793447718952';
        if (userId !== botDeveloperId) {
          return await interaction.reply("Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!");
        }
        const label = interaction.options.getString('label');
        const title = interaction.options.getString('titre');
        const colour = interaction.options.getString('coulour');
        const description = interaction.options.getString('description');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "You must be an admin to create a verification message", ephemeral: true});

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setEmoji(`✅`)
            .setLabel(`${label}`)
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setColor(`${colour}`)
        .setTitle(`${title}`)
        .setDescription(`${description}`)

        await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {

            await i.update({ embeds: [embed], components: [button] });



            const member = i.member

            member.roles.add(role);

            i.user.send(`Vous êtes maintenant vérifié dans **${i.guild.name}**`).catch(err => {
                return;
            });
        })
    }
}