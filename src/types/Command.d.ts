import {CommandCategory} from "./CommandCategory";
import {AutocompleteInteraction, Interaction, SlashCommandBuilder} from "discord.js";

export interface Command {
    type: CommandType
    data: SlashCommandBuilder,
    category: CommandCategory;
    usage: string;
    execute: (interaction: Interaction<any>, ...args: any) => Promise<void>;
    autocomplete: (interaction: AutocompleteInteraction<any>, ...args: any) => Promise<void>;
}