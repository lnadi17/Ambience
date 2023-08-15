import {CommandCategory} from "./CommandCategory";
import {SlashCommandBuilder} from "discord.js";

export interface Command {
    type: CommandType
    data: SlashCommandBuilder,
    category: CommandCategory;
    usage: string;
    execute: (interaction: any, ...args: any) => Promise<void>;
}