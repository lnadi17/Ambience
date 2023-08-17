import {Client, Collection} from "discord.js";
import {Command} from "./Command";
import {AmbiencePlayerManager} from "./AmbiencePlayerManager";

export class AmbienceClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    readonly playerManager: AmbiencePlayerManager = new AmbiencePlayerManager();
}