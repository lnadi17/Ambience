import {CommandCategory} from "../types/CommandCategory";
import {AutocompleteInteraction, SlashCommandBuilder} from "discord.js";
import {connectToChannel, getSoundsList} from "../utils";
import {AmbienceClient} from "../types/AmbienceClient";

export default {
    usage: "/play [sound]",
    data: new SlashCommandBuilder().setName("play").setDescription("Plays specified sound")
        .addStringOption(option =>
            option
                .setName("sound")
                .setDescription("The sound title to play")
                .setRequired(true)
                .setAutocomplete(true)
                // .addChoices(
                //     ...getSoundsList().map(sound => {
                //         return {name: sound.title, value: sound.title}
                //     })
                // )
        ),
    category: CommandCategory.Sound,
    execute: async (interaction, bot: AmbienceClient) => {
        const member = await interaction.guild?.members.fetch(interaction.user);
        const soundName = interaction.options.getString('sound');
        if (member?.voice.channel) {
            await interaction.reply({content: `Playing ${soundName}`, ephemeral: true});
            try {
                const connection = await connectToChannel(member.voice.channel);
                await bot.playerManager.attachSubscriberToPlayer(connection, soundName);
            } catch {
                await interaction.editReply({content: "There was an error while playing the sound.", ephemeral: true})
            }
        } else {
            await interaction.reply({
                content: "You need to be in a voice channel to use this command.",
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
            limited.map(choice => ({ name: choice, value: choice })),
        );
    }
}