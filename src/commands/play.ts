import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder, VoiceBasedChannel
} from "discord.js";
import {connectToChannel, getSoundsList, matchCategoryButton, matchSongButton} from "../utils";
import {
    getPlayComponentsEmbed,
    getPlayEmbed,
    getPlayErrorEmbed, getPlaySoundEmbed,
    getWarningEmbed
} from "../scripts/getEmbeds";
import {Command} from "../types/Command";
import {getPlayComponents, getPlaySoundComponents} from "../scripts/getComponents";
import {CommandCategory} from "../interfaces/CommandCategory";
import {AmbienceClient} from "../interfaces/AmbienceClient";

export default {
    usage: ["/play", "/play [sound]"],
    data: new SlashCommandBuilder().setName("play").setDescription("Plays a specified sound")
        .addStringOption(option =>
            option
                .setName("sound")
                .setDescription("The sound title to play")
                .setRequired(false)
                .setAutocomplete(true)
        ),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member: GuildMember = await interaction.guild?.members.fetch(interaction.user);
        const soundName = interaction.options.getString('sound');
        if (member?.voice.channel) {
            if (soundName) {
                await playSpecificSound(interaction, soundName, member.voice.channel, bot);
            } else {
                await playInteraction(interaction, member.voice.channel, bot);
            }
        } else {
            await interaction.reply({
                embeds: [getWarningEmbed("Ambience Radio", "You need to be in the voice channel to use this command")],
                ephemeral: true
            });
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
            limited.map(choice => ({name: choice, value: choice})),
        );
    },
} as Command;

async function playSpecificSound(interaction: ChatInputCommandInteraction<any>, soundName: string, channel: VoiceBasedChannel, bot: AmbienceClient) {
    await interaction.reply({embeds: [getPlayEmbed(soundName)]});
    try {
        const connection = await connectToChannel(channel);
        await bot.playerManager.attachSubscriberToPlayer(connection, soundName);
    } catch {
        await interaction.editReply({embeds: [getPlayErrorEmbed(soundName)]})
    }
}

async function playInteraction(interaction: ChatInputCommandInteraction<any>, channel: VoiceBasedChannel, bot: AmbienceClient) {
    // Return interactive sound list
    const response = await interaction.reply({
        embeds: [getPlayComponentsEmbed()],
        components: getPlayComponents()
    });
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        // Choose category
        const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60000});
        const songCategory = matchCategoryButton(confirmation.customId);
        if (!songCategory) {
            await confirmation.update({
                embeds: [getWarningEmbed("Ambience Radio", "Could not find such category")],
                components: getPlayComponents(false)
            });
            return;
        }

        // Choose song
        await confirmation.update({
            embeds: [getPlaySoundEmbed(songCategory)],
            components: getPlaySoundComponents(songCategory)
        })
        const songConfirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60000});
        const song = matchSongButton(songConfirmation.customId);
        if (!song) {
            await confirmation.update({
                embeds: [getWarningEmbed("Ambience Radio", "Could not find such sound")],
                components: getPlaySoundComponents(songCategory, false)
            });
            return;
        }

        // Play song
        await songConfirmation.update({
            components: getPlaySoundComponents(songCategory, false)
        })
        const followUp = await interaction.followUp({embeds: [getPlayEmbed(song.title)]});
        try {
            const connection = await connectToChannel(channel);
            await bot.playerManager.attachSubscriberToPlayer(connection, song.title);
        } catch {
            await followUp.edit({embeds: [getPlayErrorEmbed(song.title)]})
        }
    } catch (e) {
        await interaction.editReply({
            embeds: [getWarningEmbed("Ambience Radio", "Confirmation not received within 1 minute")],
            components: getPlayComponents(false)
        });
    }
}
