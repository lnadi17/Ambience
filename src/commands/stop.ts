import {SlashCommandBuilder} from "discord.js";
import {getVoiceConnection} from "@discordjs/voice";
import {getStopEmbed} from "../scripts/getEmbeds";
import {Command} from "../types/Command";
import {CommandCategory} from "../interfaces/CommandCategory";

export default {
    usage: "`/stop`",
    data: new SlashCommandBuilder().setName("stop").setDescription("Stops current sound"),
    category: CommandCategory.Sound,
    execute: async (interaction) => {
        getVoiceConnection(interaction.guildId)?.destroy();
        await interaction.reply({embeds: [getStopEmbed()]});
    }
} as Command;