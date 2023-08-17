import {CommandCategory} from "../types/CommandCategory";
import {Message, SlashCommandBuilder} from "discord.js";
import {connectToChannel, getRandomSound} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";
import {getPlayEmbed, getPlayErrorEmbed, getRandomEmbed, getWarningEmbed} from "../scripts/getEmbeds";

export default {
    usage: "`/random`",
    data: new SlashCommandBuilder().setName("random").setDescription("Plays a random sound"),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        const randomSoundTitle = getRandomSound().title;
        if (member?.voice.channel) {
            // Change color 5 times
            await interaction.reply({embeds: [getRandomEmbed("Generating random sound...", true)], ephemeral: true});
            await new Promise(resolve => setTimeout(resolve, 200));
            for (let i = 0; i < 4; i++) {
                await interaction.editReply({embeds: [getRandomEmbed("Generating random sound...", true)], ephemeral: true});
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            await interaction.editReply({embeds: [getRandomEmbed(`Random sound is: **${randomSoundTitle}**`)], ephemeral: true});
            const followUp: Message = await interaction.followUp({embeds: [getPlayEmbed(randomSoundTitle)]});

            try {
                const connection = await connectToChannel(member.voice.channel);
                await bot.playerManager.attachSubscriberToPlayer(connection, randomSoundTitle);
            } catch {
                await followUp.edit({embeds: [getPlayErrorEmbed(randomSoundTitle)]})
            }
        } else {
            await interaction.reply({embeds: [getWarningEmbed("Ambience Radio", "You need to be in the voice channel to use this command")], ephemeral: true});
        }
    }
}