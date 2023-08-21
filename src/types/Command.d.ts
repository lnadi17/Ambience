import {CommandCategory} from "./CommandCategory";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {AmbienceClient} from "./AmbienceClient";

export interface Command {
    type: CommandType
    data: SlashCommandBuilder,
    category: CommandCategory;
    usage: string;
    execute: (interaction: ChatInputCommandInteraction<any>, bot?: AmbienceClient) => Promise<void>;
    autocomplete: (interaction: AutocompleteInteraction<any>, bot?: AmbienceClient) => Promise<void>;
}