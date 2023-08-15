import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";


export default {
    usage: "/ping",
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    category: CommandCategory.Settings,
    execute: async (interaction) => {
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    }
}