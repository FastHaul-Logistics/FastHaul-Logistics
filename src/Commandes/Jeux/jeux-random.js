const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("jeux-random")
    .setDescription("jouer au hasard")
    .addStringOption(option => option
        .setName("catégorie")
        .setDescription("catégorie")
        .addChoices(
            {name: "FPS", value: "FPS"},
            {name: "Shooter", value: "Shooter"},
            {name: "Arcade", value: "Arcade"},
            {name: "Rythm", value: "Rythm"},
            {name: "Action", value: "Action"},
            {name: "Racing", value: "Racing"},
            {name: "Military", value: "Military"},
            {name: "Adventure", value: "Adventure"},
        )
        .setRequired(true)
    ),
 
    async execute (interaction) {
        const Rythm = ["Fuser", "AVICII Invector", "Ragnarock", "Friday Night Funkin", "Just Dance", "Thumper", "Guitar Hero 3: Legends Of Rock", "Crypt Of The NecroDancer", "Pistol Whip", "Beat Saber"];
        const FPS = ["Halo Infinite", "Call of Duty MW2", "Warzone 2", "Quake 2021", "Black Mesa", "Doom Eternal", "Overwatch 2", "CS:GO", "Half Life 2", "Rainbow Six Siege", "Escape from tarkov", "Titanfall 2", "Left 4 dead 2", "Team Fortess 2", "Valorant", "Unreal Tournament"];
        const Arcade = ["Dead Cells 2", "Fantasian", "NUTS", "Disney Melee Mania", "Assemble with care", "Monster Hunter Strory +", "Card of Darkness", "Survival Z"];
        const Shooter = ["Apex Legends", "Call of Duty MW2", "CS:GO", "Destiny 2", "Fortnite", "PUBG", "Valorant", "Overwatch 2", "Battlefield 2042", "Ranbow 6 Siege"];
        const Military = ["Hell let loose", "Pavlov VR", "ARMA 3", "Sniper: Ghost Warrior Contracts 2", "Squad", "Enlisted", "Call of Duty: Vanguard", "Defcon", "Tannenberg", "WARNO"];
        const Action = ["Dead Cells", "Sekiro: Shadows Die Twice", "Bayonetta", "Batman Arkham City", "Hotline Miami", "Devil May Cry 5", "Monster Hunter World", "Vanquish", "Resident Evil 2 (2019)", "TowerFall: Ascension"];
        const Racing = ["Forza Horizon 5", "Dirt Rally 2", "Shift 2", "Art of Rally", "Project Cars 2", "Wreckfest"];
        const Adventure = ["The walking dead", "Chuchel", "Broken Sword", "Return to monkey island"];
 
        const Category = interaction.options.getString("category");
 
        if (Category === "Rythm") {
            const choices = Math.floor(Math.random() * Rythm.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeu pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Rythm[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "FPS") {
            const choices = Math.floor(Math.random() * FPS.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${FPS[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "Arcade") {
            const choices = Math.floor(Math.random() * Arcade.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${FPS[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
 
        if (Category === "Shooter") {
            const choices = Math.floor(Math.random() * Shooter.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Shooter[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "Military") {
            const choices = Math.floor(Math.random() * Military.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Military[choices]}`, inline: true},
                {name: "demandé par:",value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "Action") {
            const choices = Math.floor(Math.random() * Action.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Action[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "Racing") {
            const choices = Math.floor(Math.random() * Racing.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Action[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
        if (Category === "Adventure") {
            const choices = Math.floor(Math.random() * Adventure.length);
 
            const embed = new EmbedBuilder()
            .setTitle(`Jeux pour la catégorie: ${Category}`)
            .setColor("#c5ae00")
            .addFields(
                {name: "Jeux", value: `${Adventure[choices]}`, inline: true},
                {name: "demandé par:", value: `<@${interaction.user.id}>`, inline: true}
            )
 
            return interaction.reply({
                embeds: [embed]
            });
        }
 
 
    }
}