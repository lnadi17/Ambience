import {Client, Collection} from "discord.js";
import {AmbiencePlayerManager} from "./AmbiencePlayerManager";
import {Command} from "../types/Command";

export class AmbienceClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    readonly playerManager: AmbiencePlayerManager = new AmbiencePlayerManager();
}