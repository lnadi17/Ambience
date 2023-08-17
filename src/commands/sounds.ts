import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {getAllSoundsEmbed} from "../scripts/getEmbeds";

export default {
    usage: "`/sounds`",
    data: new SlashCommandBuilder().setName("sounds").setDescription("Lists all sound names"),
    category: CommandCategory.Info,
    execute: async (interaction) => {
            await interaction.reply({embeds: [getAllSoundsEmbed()], ephemeral: true})
    }
}