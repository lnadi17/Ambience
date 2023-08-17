import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {listAllSounds} from "../scripts/getEmbeds";

export default {
    usage: "/sounds",
    data: new SlashCommandBuilder().setName("sounds").setDescription("Lists all sound names"),
    category: CommandCategory.Settings,
    execute: async (interaction) => {
            await interaction.reply({embeds: [listAllSounds()], ephemeral: true})
    }
}