import {CommandCategory} from "../types/CommandCategory";
import {APIApplicationCommandOptionChoice, SlashCommandBuilder} from "discord.js";
import {listCategories, listCategorySongs} from "../scripts/getEmbeds";
import categories from "../data/songs";

export default {
    usage: "/categories",
    data: new SlashCommandBuilder().setName("categories").setDescription("Lists all sound categories.")
        .addStringOption(option =>
            option.setName("category")
                .setDescription("The category to list sounds for.")
                .setRequired(false)
                .addChoices(
                    ...categories.map((category) => {
                        return {
                            name: category.name,
                            value: category.name
                        }
                    })
                )),
    category: CommandCategory.Settings,
    execute: async (interaction) => {
        const categoryName = interaction.options.getString('category');
        if (categoryName) {
            await interaction.reply({embeds: [listCategorySongs(categoryName)], ephemeral: true})
        } else {
            await interaction.reply({embeds: [listCategories()], ephemeral: true});
        }
    }
}