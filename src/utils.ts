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

/*
// Helper Functions

async function playCommand(message, args) {
    console.log("top", message.content)
    if (bot.player.isPlaying(message)) {
        console.log("resume", modifyMessageForMusic(message).c);
        let song = await bot.player.addToQueue(modifyMessageForMusic(message), args.join(' '));
        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if (song)
            console.log(`Added ${song.name} to the queue`);
        return;
    } else {
        message.channel.send(listLoadingMessage());
        console.log("resume", modifyMessageForMusic(message));
        let song = await bot.player.play(modifyMessageForMusic(message), args.join(' '));
        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if (song)
            console.log(`Started playing ${song.name}`);
        return;
    }
}

async function playAmbienceSong(message, args, musicLink) {
    try {
        if (bot.player.isPlaying(message)) {
            await bot.player.addToQueue(message, {search: musicLink, requestedBy: musicLink});
        } else {
            message.channel.send(listLoadingMessage());
            await bot.player.play(message, {
                search: musicLink,
                requestedBy: musicLink
            })
        }
    } catch (err) {
        console.log("caught the error");
        message.channel.send("❌ You must be in a voice channel to use this command.");
    }
}

function shuffleArray(array) {
    let newArray = array;
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function playPlaylist(message, args) {
    let shuffledPlaylist = shuffleArray(playlistTracks);
    console.log("dashdsa", shuffledPlaylist)
    // console.log("adshdsajk", shuffledPlaylist[0])
    // message.content = `!play `
    // await playCommand(message, args)
    for (let i = 0; i < shuffledPlaylist.length; i++) {
        await playCustomSong(message, shuffledPlaylist[i], "play");
    }

}

async function playCustomSong(message, songValue, isPlaylist) {
    try {
        message.content = `!play ${songValue}`;
        let args = message.content.slice(configPrefix.length).trim().split(/ +/g);
        if (bot.player.isPlaying(message)) {
            let song = await bot.player.play(message, args.join(' '));
            console.log("is", isPlaylist)

            if (song && (isPlaylist !== "play")) {
                console.log(`Added ${song.name} to the queue`);
            }

            return;
        } else {
            message.channel.send(listLoadingMessage());
            let song = await bot.player.play(message, args.join(' '));

            // If there were no errors the Player#songAdd event will fire and the song will not be null.
            if (song)
                console.log(`Started playing ${song.name}`);
            return;
        }
    } catch (err) {
        console.log("caught tne erroe");
        message.channel.send("❌ You must be in a voice channel to use this command.");
    }

}

export function refineContent(input) {
    let content = input.split(" ")[1];
    let contentArray = input.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    return content;
}

export function getProperSoundContent(song) {
    let selectedSong = getSongFromURL(song.requestedBy);
    if (selectedSong) {
        return selectedSong.name;
    }
    return song.name;
}

*/
