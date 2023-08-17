import {CommandCategory} from "../types/CommandCategory";
import {AutocompleteInteraction, SlashCommandBuilder} from "discord.js";
import {connectToChannel, getSoundsList} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";
import {getPlayEmbed, getPlayErrorEmbed, getWarningEmbed} from "../scripts/getEmbeds";

export default {
    usage: "`/play [sound]`",
    data: new SlashCommandBuilder().setName("play").setDescription("Plays a specified sound")
        .addStringOption(option =>
            option
                .setName("sound")
                .setDescription("The sound title to play")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        const soundName = interaction.options.getString('sound');
        if (member?.voice.channel) {
            await interaction.reply({embeds: [getPlayEmbed(soundName)]});
            try {
                const connection = await connectToChannel(member.voice.channel);
                await bot.playerManager.attachSubscriberToPlayer(connection, soundName);
            } catch {
                await interaction.editReply({embeds: [getPlayErrorEmbed(soundName)]})
            }
        } else {
            await interaction.reply({embeds: [getWarningEmbed("Ambience Radio", "You need to be in the voice channel to use this command")], ephemeral: true});
        }
    },
    autocomplete: async (interaction: AutocompleteInteraction<any>) => {
        // @ts-ignore
        const focusedValue = interaction.options.getFocused().toLowerCase();
        if (focusedValue === '') {
            await interaction.respond([]);
            return;
        }

        // Return top 25 sounds that start with the focused value
        const choices = getSoundsList().map(sound => sound.title);
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue));
        const limited = filtered.slice(0, 25);
        await interaction.respond(
            limited.map(choice => ({ name: choice, value: choice })),
        );
    }
}