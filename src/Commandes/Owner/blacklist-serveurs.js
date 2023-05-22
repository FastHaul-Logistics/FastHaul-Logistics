const { SlashCommandBuilder } = require('discord.js')
const blacklistserver = require('../../Schemas/blacklistserv.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blacklist-serveurs')
    .setDescription('Blacklist a server from your client')
    .addSubcommand(command => command.setName('ajoutée').setDescription('Add a server to the blacklist').addStringOption(option => option.setName('serveur').setDescription('the server ID you want to blacklist').setRequired(true)))
    .addSubcommand(command => command.setName('suppression').setDescription('Remove a server from the blacklist').addStringOption(option => option.setName('serveur').setDescription('The server ID you want to blacklist').setRequired(true))),
    async execute(interaction) {

        const {options} = interaction;
        if (interaction.user.id !== '1082011193247539240') return await interaction.reply({ content: "Tu n'est pas le créateur du bot tu n'est donc pas autorisée a utilisée cette commande !!", ephemeral: true})

        const server = options.getString('server');
        const sub = options.getSubcommand();
        const data = await blacklistserver.findOne({ Guild: server });

        switch (sub) {
            case 'ajoutée':

            if (!data) {
                await blacklistserver.create({
                    Guild: server,
                })

                await interaction.reply({ content: `**Adding Blacklist...**`, ephemeral: true });
                setTimeout(async () => {
                    await interaction.editReply({ content: `**Indexing servers...**`, ephemeral: true });

                    const check = await client.guilds.cache.get(server);
                    if (check) {
                        await check.leave();
                        setTimeout(async () => {
                            await interaction.editReply({ content: `Blacklist **complete** ! I have also gone ahead and left the server \`${server}\` as i was already in it`, ephemeral: true })
                        }, 3000)
                    } else {
                        setTimeout(async () => {
                            await interaction.editReply({ content: `Blacklist **complete** ! I cannot join \`${server}\` anymore`, ephemeral: true })
                        })
                    }
                }, 2000)
            } else {
                return await interaction.reply({ content: `The serveur \`${server}\` is already **blacklisted**`, ephemeral :true })
            }

            break;
            case 'remove':

            if (!data) {
                return await Interaction.reply({ content: `The server \`${server}\` is not currently **blacklisted**`, ephemeral: true });
            } else {
                await blacklistserver.deleteMany({ Guild: server });
                return await interaction.reply({ content: `I have removed \`${server}\` from the **blacklist**`, ephemeral: true });
            }
        }
    }
}