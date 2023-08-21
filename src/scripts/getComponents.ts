import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import categories from "../data/categories";
import {SongCategory} from "../types/SongCategory";
import {Song} from "../types/Song";

export function getPlayComponents(enabled = true) {
    let rows: ActionRowBuilder<ButtonBuilder>[] = []
    let currentRow;
    categories.forEach((category, index) => {
        if (index % 3 === 0) {
            if (currentRow) rows.push(currentRow);
            currentRow = new ActionRowBuilder<ButtonBuilder>()
        }
        currentRow.addComponents(getCategoryButton(category, enabled));
    })
    if (currentRow) rows.push(currentRow);
    return rows;
}

export function getPlaySoundComponents(category: SongCategory, enabled = true) {
    const maxCols = 5;

    let rows: ActionRowBuilder<ButtonBuilder>[] = []
    let currentRow;
    category.songs.forEach((song, index) => {
        if (index % maxCols === 0) {
            if (currentRow) rows.push(currentRow);
            currentRow = new ActionRowBuilder<ButtonBuilder>()
        }
        currentRow.addComponents(getSongButton(song, enabled));
    })
    if (currentRow) rows.push(currentRow);
    return rows;
}

function getCategoryButton(category: SongCategory, enabled = true) {
    return new ButtonBuilder()
        .setLabel(`${category.emoji} ${category.name}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`category_${category.name}`)
        .setDisabled(!enabled);
}

function getSongButton(song: Song, enabled = true) {
    return new ButtonBuilder()
        .setLabel(`${song.title}`)
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`song_${song.title}`)
        .setDisabled(!enabled);
}