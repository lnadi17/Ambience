import {VoiceBasedChannel} from "discord.js";
import {AudioPlayer, createAudioResource, entersState, joinVoiceChannel, VoiceConnectionStatus} from "@discordjs/voice";
import path, {join} from "path";
import fs from "fs";
import {Command} from "./types/Command";

export async function connectToChannel(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

export function attachRecorder(player: AudioPlayer) {
    // TODO: Use ogg or webm format for better performance
    player.play(createAudioResource(join(__dirname, 'data/2min30sec.mp3')));
    console.log("Recorder attached!")
}

export async function getAllCommands() : Promise<Command[]> {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    const commandPromises: Promise<any>[] = [];
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        commandPromises.push(import(filePath));
    }
    return Promise.all(commandPromises).then((commands) => {
        return commands.map((command) => command.default);
    });
}
