import {CommandCategory} from "../types/CommandCategory";
import {SlashCommandBuilder} from "discord.js";
import {connectToChannel, getRandomSound} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";

export default {
    usage: "/random",
    data: new SlashCommandBuilder().setName("random").setDescription("Plays a random sound"),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        const randomSoundTitle = getRandomSound().title;
        if (member?.voice.channel) {
            await interaction.reply({content: `Playing ${randomSoundTitle}.`, ephemeral: true});
            try {
                const connection = await connectToChannel(member.voice.channel);
                await bot.playerManager.attachSubscriberToPlayer(connection, randomSoundTitle);
            } catch {
                await interaction.editReply({content: "There was an error while playing the sound.", ephemeral: true})
            }
        } else {
            await interaction.reply({content: "You need to be in a voice channel to use this command.", ephemeral: true});
        }
    }
}