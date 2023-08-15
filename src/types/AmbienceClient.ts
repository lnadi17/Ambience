import {Client, Collection} from "discord.js";
import {AudioPlayer, createAudioPlayer, NoSubscriberBehavior} from "@discordjs/voice";
import {Command} from "./Command";

export class AmbienceClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public player: AudioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        }
    });
}