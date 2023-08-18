import {CommandCategory} from "./CommandCategory";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";

export interface Command {
    type: CommandType
    data: SlashCommandBuilder,
    category: CommandCategory;
    usage: string;
    execute: (interaction: ChatInputCommandInteraction<any>, ...args: any) => Promise<void>;
    autocomplete: (interaction: AutocompleteInteraction<any>, ...args: any) => Promise<void>;
}