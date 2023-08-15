import {CommandCategory} from "./CommandCategory";

export interface Command {
    name: string;
    description: string;
    category: CommandCategory;
    usage: string;
}