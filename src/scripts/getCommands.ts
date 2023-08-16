import * as Discord from 'discord.js';

// import { matchCategoryByName } from "./matchCommands";
import songsData from '../data/categories';
import {AmbienceClient} from "../types/AmbienceClient";

export function getKeyWord(keyword, command: string) {
    let prefixKeyword = '/' + keyword;
    let prompt = command.slice(0, keyword.length + 1);
    return prompt == prefixKeyword && command.split(" ").length > 1;
}

export function getCommandWithPrefix(command: string){
    return '/' + command;
}

/*
export function getQueueEmbed(sounds){
    let text = `**Now Playing:** ${sounds[0].name} \n`;
    if(sounds.length > 1){
        for(let i = 1; i < sounds.length; i++){
            if(getSongFromURL(sounds[i].requestedBy).name){
                text = text.concat(`\n **#${i}** - ${getSongFromURL(sounds[i].requestedBy).name}`)
            }else{
                text = text.concat(`\n **#${i}** - ${sounds[i].url}`)
            }
           
        }
    }
    
    const queueEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('🎶 Channel Queue 🎶')
	.setDescription(text);
    return queueEmbed;
}
*/

export function getSongsFromData(data: any) {
    let songs: any[] = [];
    data.forEach((category: any) => {
        Array.prototype.push.apply(songs, category.songs);
    })
    return songs;
}

/*
export function getSongFromURL(songLink){
    for(let song of sounds){
        if(song.link == songLink){
            return song;
        }
    }
    return false;
}

 */

export function getCommandsForCategory(category: any, bot: AmbienceClient){
    let selectedCommands: any = [];
    bot.commands.forEach((command) => {
        if(command.category == category) selectedCommands.push(command);
    })
    return selectedCommands;
}

/*
export function getCommandByName(commandName){
    for(let command of commands){
        if(command.command == commandName) return command;
    }
    return null;
}

export function getIfValidCommand(input){
    for(let command of commands){
        if(command.command == input) return true;
    }
    return false;
}

// lowercase and remove emoji for user song and category name input
// this makes searching for the category or song more accurate and efficent
export function getPurifiedInput(input) {
    let removeEmojiString = input.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    let lowercase = removeEmojiString.replace(/\s/g, "").toLowerCase();
    return lowercase;
}

export function getSongsForCategory(categoryInput) {
    let matchedCategory = matchCategoryByName(categoryInput);
    return matchedCategory.sounds;
}

export function getAllSounds(){
    let allSounds = [];
    for(let category of categories){
        let categorySounds = getSongsForCategory(category.name);
        allSounds = allSounds.concat(categorySounds);
    }
    return allSounds;
}

export function getRandomSound(){
    let allSounds = getAllSounds();
    var item = allSounds[Math.floor(Math.random()*allSounds.length)];
    return item;
}
*/