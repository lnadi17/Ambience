import {Command} from "../types/Command";
import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {connectToChannel} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";
import {AmbiencePlayerManager} from "../types/AmbiencePlayerManager";

export default {
    usage: "/play [sound]",
    data: new SlashCommandBuilder().setName("play").setDescription("Plays specified sound."),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        if (member?.voice.channel) {
            await interaction.reply({content: "Playing Skyrim", ephemeral: true});
            try {
                const connection = await connectToChannel(member.voice.channel);
                await bot.playerManager.attachSubscriberToPlayer(connection, 'Skyrim');
            } catch {
                await interaction.editReply({content: "There was an error while playing the sound.", ephemeral: true})
            }
        } else {
            interaction.reply({content: "You need to be in a voice channel to use this command.", ephemeral: true});
        }
    }
}