import {VoiceBasedChannel} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnectionStatus} from "@discordjs/voice";
import categories from "./data/categories";
import path, {join} from "path";
import fs from "fs";
import {Command} from "./types/Command";
import {Song} from "./types/Song";
import {CommandCategory} from "./interfaces/CommandCategory";
import {SongCategory} from "./types/SongCategory";

export function getRandomSound(): Song {
    const songs = categories.map(category => category.songs).flat();
    return songs[Math.floor(Math.random() * songs.length)];
}

export function getSoundsList(): Song[] {
    return categories.map(category => category.songs).flat();
}

export async function getCommandsForCategory(category: CommandCategory) {
    return getAllCommands().then((commands) => {
        return commands.filter((command) => command.category === category);
    });
}

export async function connectToChannel(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })

    // Attach disconnection handler
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy();
        }
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

export async function getAllCommands(): Promise<Command[]> {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const commandPromises: Promise<any>[] = [];
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        commandPromises.push(import(filePath));
    }
    return Promise.all(commandPromises).then((commands) => {
        return commands.map((command) => command.default);
    });
}

export function matchCategoryButton(customId: string) : SongCategory | undefined {
    const categoryString = customId.split('_')[1];
    return categories.find(item => item.name.toLowerCase() === categoryString.toLowerCase());
}

export function matchSongButton(customId: string) : Song | undefined {
    const songString = customId.split('_')[1];
    return getSoundsList().find(item => item.title.toLowerCase() === songString.toLowerCase());
}