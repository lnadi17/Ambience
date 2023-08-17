import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";


export default {
    usage: "`/ping`",
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    category: CommandCategory.Info,
    execute: async (interaction) => {
        await interaction.reply(`Pong!`);
    }
}