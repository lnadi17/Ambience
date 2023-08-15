import {Command} from "../types/Command";
import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {connectToChannel} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";

export default {
    usage: "/play [sound]",
    data: new SlashCommandBuilder().setName("play").setDescription("Plays specified sound."),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        if (member?.voice.channel) {
            const connection = await connectToChannel(member.voice.channel);
            connection.subscribe(bot.player);
            interaction.reply("Playing");
        } else {
            // Send ephemeral message
            interaction.reply("You need to be in a voice channel to use this command.");
        }
    }
}