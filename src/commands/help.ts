import {Command} from "../types/Command";
import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {getCommandInfo, getHelpEmbed} from "../scripts/getEmbeds";
import {AmbienceClient} from "../types/AmbienceClient";
import {join} from "path";
import fs from "fs";
import path from "path";
import {getAllCommands} from "../utils";
import {CommandName} from "../types/CommandName";

export default {
    usage: "`/help` or `/help [command]`",
    data: new SlashCommandBuilder().setName("help").setDescription("List commands or give information about a command.")
        .addStringOption(option =>
            option.setName("command")
                .setDescription("The command to get information about.")
                .setRequired(false)
                .addChoices(
                    ...Object.values(CommandName).map((commandName) => {
                        return {name: commandName, value: commandName}
                    }))),
    category: CommandCategory.Settings,
    execute: async (interaction, bot: AmbienceClient) => {
        const commandName = interaction.options.getString("command");
        const command = bot.commands.get(commandName);
        if (command) {
            await interaction.reply({embeds: [getCommandInfo(command)], ephemeral: true});
        } else {
            await interaction.reply({embeds: [getHelpEmbed(bot)], ephemeral: true});
        }
    }
}