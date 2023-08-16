import {CommandCategory} from "../types/CommandCategory";
import {APIApplicationCommandOptionChoice, SlashCommandBuilder} from "discord.js";
import {listAllSounds, listCategories, listCategorySongs} from "../scripts/getEmbeds";
import categories from "../data/categories";

export default {
    usage: "/sounds",
    data: new SlashCommandBuilder().setName("sounds").setDescription("Lists all sound names."),
    category: CommandCategory.Settings,
    execute: async (interaction) => {
            await interaction.reply({embeds: [listAllSounds()], ephemeral: true})
    }
}