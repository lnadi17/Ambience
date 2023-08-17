import {Collection} from "discord.js";
import {
    AudioPlayer, AudioPlayerError,
    AudioPlayerStatus,
    createAudioResource, entersState,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnection
} from "@discordjs/voice";
import {SongCategory} from "./SongCategory";
import {Song} from "./Song";
import {createReadStream} from "node:fs";
import {join} from "path";
import categories from "../data/categories";

export class AmbiencePlayerManager {
    private static players: Collection<string, AudioPlayer> = new Collection();

    private static createResource(category: SongCategory, song: Song) {
        const stream = createReadStream(join(__dirname, `../../sounds/${category.name}/${song.title}.opus`));
        return createAudioResource(stream, {
            inputType: StreamType.OggOpus,
        });
    }

    private static createAudioPlayer(category: SongCategory, song: Song): AudioPlayer {
        console.log(`Audio player created for ${category.name}/${song.title}!`)
        let player: AudioPlayer = new AudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            }
        });

        const cleanupPlayer = () => {
            console.log(`Removing all listeners from ${song.title}...`);
            player.stop();
            player.removeAllListeners();
            AmbiencePlayerManager.players.delete(song.title);
        }

        player.on(AudioPlayerStatus.Idle, () => {
            // The audio player will be in this state when there is no audio resource for it to play
            // This is basically a replay feature
            player.play(this.createResource(category, song));
        });

        player.on(AudioPlayerStatus.AutoPaused, async () => {
            try {
                console.log(`${song.title} AutoPaused. Started waiting for subscribers...`)
                await Promise.race([
                    entersState(player, AudioPlayerStatus.Playing, 30_000),
                    entersState(player, AudioPlayerStatus.Buffering, 30_000),
                ]);
            } catch {
                cleanupPlayer();
            }
        });

        player.on("subscribe", () => {
            // We have a subscriber. Next statement will be true when first subscriber joins.
            if (player.state.status === AudioPlayerStatus.Idle) {
                player.play(this.createResource(category, song));
            }
        });

        player.on("error", (error: AudioPlayerError) => {
            console.log(`AudioPlayerError: ${error.message}`);
            cleanupPlayer();
        });

        // player.on("debug", (message) => {
        //     console.log(message);
        // });

        return player;
    }

    private static listAllPlayers() {
        this.players.forEach((player, key) => {
            console.log(`${key}: ${player.state.status}`)
        });
    }

    private getCategoryAndSongFromTitle(title: string): [SongCategory, Song] {
        const category = categories.find((category) => {
            return category.songs.find((song) => song.title === title);
        });
        if (!category)
            throw new Error(`Could not find ${title} in any category!`);
        const song = category.songs.find((song) => song.title === title);
        return [category, song!];
    }

    public async attachSubscriberToPlayer(connection: VoiceConnection, songTitle: string) {
        // Create a new player if one doesn't exist
        if (!AmbiencePlayerManager.players.has(songTitle)) {
            const [category, song] = this.getCategoryAndSongFromTitle(songTitle);
            AmbiencePlayerManager.players.set(songTitle, AmbiencePlayerManager.createAudioPlayer(category, song));
        }

        // Get the player and subscribe to it
        const player = AmbiencePlayerManager.players.get(songTitle);
        if (player) {
            connection.subscribe(player);
        } else {
            throw new Error("No player found!");
        }

        // Wait for player to enter playing state within a timeout of 5 seconds
        return entersState(player, AudioPlayerStatus.Playing, 5_000);
    }
}