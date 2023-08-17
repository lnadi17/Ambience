import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {getCategoriesEmbed, getCategorySoundsEmbed} from "../scripts/getEmbeds";
import categories from "../data/categories";

export default {
    usage: "`/categories` or `/categories [category_name]`",
    data: new SlashCommandBuilder().setName("categories").setDescription("Lists all sound categories")
        .addStringOption(option =>
            option.setName("category")
                .setDescription("The specific category to list sounds for")
                .setRequired(false)
                .addChoices(
                    ...categories.map((category) => {
                        return {
                            name: category.name,
                            value: category.name
                        }
                    })
                )),
    category: CommandCategory.Info,
    execute: async (interaction) => {
        const categoryName = interaction.options.getString('category');
        if (categoryName) {
            await interaction.reply({embeds: [getCategorySoundsEmbed(categoryName)], ephemeral: true})
        } else {
            await interaction.reply({embeds: [getCategoriesEmbed()], ephemeral: true});
        }
    }
}