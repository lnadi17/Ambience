import {SlashCommandBuilder} from "discord.js";
import {getAllSoundsEmbed} from "../scripts/getEmbeds";
import {Command} from "../types/Command";
import {CommandCategory} from "../interfaces/CommandCategory";

export default {
    usage: ["/sounds"],
    data: new SlashCommandBuilder().setName("sounds").setDescription("Lists all available sounds"),
    category: CommandCategory.Info,
    execute: async (interaction) => {
            await interaction.reply({embeds: [getAllSoundsEmbed()], ephemeral: true})
    }
} as Command;