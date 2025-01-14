import {SlashCommandBuilder} from "discord.js";
import {getCommandInfoEmbed, getHelpEmbed} from "../scripts/getEmbeds";
import {Command} from "../types/Command";
import {CommandName} from "../interfaces/CommandName";
import {CommandCategory} from "../interfaces/CommandCategory";
import {AmbienceClient} from "../interfaces/AmbienceClient";

export default {
    usage: ["/help","/help [command]"],
    data: new SlashCommandBuilder().setName("help").setDescription("Gives information about bot commands")
        .addStringOption(option =>
            option.setName("command")
                .setDescription("The command to get information about")
                .setRequired(false)
                .addChoices(
                    ...Object.values(CommandName).map((commandName) => {
                        return {name: commandName, value: commandName}
                    }))),
    category: CommandCategory.Info,
    execute: async (interaction, bot: AmbienceClient) => {
        const commandName = interaction.options.getString("command");
        const command = commandName ? bot.commands.get(commandName) : null;
        if (command) {
            await interaction.reply({embeds: [getCommandInfoEmbed(command)], ephemeral: true});
        } else {
            const helpEmbed = await getHelpEmbed();
            await interaction.reply({embeds: [helpEmbed], ephemeral: true});
        }
    }
} as Command;