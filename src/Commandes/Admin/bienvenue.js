const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const welcomeSchema = require(`../../Schemas/welcomeSchema.js`);


module.exports = {
    data: new SlashCommandBuilder()
    .setName(`bienvenue`)
    .setDescription(`Configurer un message de bienvenue`)
    .addSubcommand(subcommand =>
        subcommand
        .setName(`définir`)
        .setDescription(`Keywords = {mention}, {user}, {server}, {members}`)
        .addChannelOption(option =>
            option.setName(`salon`)
            .setDescription(`Le canal pour envoyer le message de bienvenue`)
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(`message`)
            .setDescription(`le message à envoyer`)
            .setRequired(true)

        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName(`supprimer`)
        .setDescription(`supprime le système d’accueil`)
        ),


    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: `Vous avez besoin d’une permission de gérer les messages pour exécuter cette commande!`, ephemeral: true})
        if (interaction.options.getSubcommand() === `set`) {
            const data = await welcomeSchema.findOne({
                guildid: interaction.guild.id,
            })
            if(data) {
                const channel = interaction.options.getChannel(`salon`);
                const message = interaction.options.getString(`message`);

                await welcomeSchema.findOneAndUpdate({
                    guildid: interaction.guild.id,
                    channel: channel.id,
                    message: message,
                })



                await data.save();

                const embed1 = new EmbedBuilder()
                .setColor(`#c5ae00`)
                .setTitle(`Système d’accueil`)
                .setDescription(`Message de bienvenue mis à jour à ${message} dans le canal ${channel}`)
                .setTimestamp()


                await interaction.reply({ embeds: [embed1] });

            }

            if (!data) {
                const channel = interaction.options.getChannel(`salon`);
                const message = interaction.options.getString(`message`);
                const data = await welcomeSchema.create({
                    guildid: interaction.guild.id,
                    channel: channel.id,
                    message: message,
                })

                


                await data.save();

                const embed = new EmbedBuilder()
                .setColor(`#c5ae00`)
                .setTitle(`Système d’accueil`)
                .setDescription(`Le message de bienvenue est réglé à "${message}" dans le canal ${channel}`)
                .setTimestamp()

                await interaction.reply({ embeds: [embed] });

            }

            
        }

        if (interaction.options.getSubcommand() === `supprimer`) {
            const data = await welcomeSchema.findOne({
                guildid: interaction.guild.id,
            })

            if (!data) {
                await interaction.reply({ content: `Aucun message de bienvenue trouvé!`, ephemeral: true })
            }
            else {
            await welcomeSchema.findOneAndDelete({
                guildid: interaction.guild.id,
            })

            const embed3 = new EmbedBuilder()
            .setColor(`Aqua`)
            .setTitle(`Système d’accueil`)
            .setDescription(`Message de bienvenue supprimé`)

            await interaction.reply({ embeds: [embed3] });
        }


        }
    }

}