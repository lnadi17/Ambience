import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {getVoiceConnection} from "@discordjs/voice";

export default {
    usage: "/stop",
    data: new SlashCommandBuilder().setName("stop").setDescription("Stops current sound"),
    category: CommandCategory.Sound,
    execute: async (interaction) => {
        getVoiceConnection(interaction.guildId)?.destroy();
        interaction.reply({content: "Stopped current sound.", ephemeral: true})
    }
}