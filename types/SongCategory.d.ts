import {Song} from "./Song";

export interface SongCategory {
    name: string;
    emoji: string;
    songs: Song[];
}