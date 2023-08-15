import {getCommandWithPrefix} from "./getCommands";
import commandsInput from '../data/commands';
import * as Discord from "discord.js";
import commands from "../data/commands";
import {Song} from "../types/Song";
import {Command} from "../types/Command";

// const categories = songsData.categories;
// const songs = getSongsFromData(categories);

export function getInviteEmbed() {
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Thanks for Inviting Ambience!')
        .setDescription(`Use the command ${getCommandWithPrefix("commands")} to see all commands. \n For more information please visit the [Ambience Website](https://angelina-tsuboi.github.io/Ambience/). Please consider joining our [Discord server](https://discord.com/invite/w3Tp9x88Nw) to meet people within our community. \n`)
        .addFields([
            {name: '\n \n 🎶 View Sounds', value: ` \`\`\` ${getCommandWithPrefix("sounds")} \`\`\` `, inline: true},
            {
                name: '🎙 View Sound Categories',
                value: ` \`\`\` ${getCommandWithPrefix("categories")} \`\`\` `,
                inline: true
            },
            {name: '❓ Get Help', value: ` \`\`\` ${getCommandWithPrefix("command help")} \`\`\` `, inline: true},
            {
                name: '\n 🔍 FAQ and Support',
                value: 'Please join the [Ambience server](https://discord.gg/w3Tp9x88Nw) for support'
            },
        ]);
}

export function listCommands() {
    let text = "Here is a list of my commands: ";
    commands.forEach((command) => {
        text = text.concat(` \n - ${command}`)
    });
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ambience Commands')
        .setDescription(text)
        .addFields({
            name: `To get more information about a specific command type: `,
            value: ` \`\`\` ${getCommandWithPrefix("command [command_name]")} \`\`\` `
        })
}

/*
export function listCategorySongs(content) {
    let matchedCategory = matchCategoryByName(content);
    let text = "";
    let count = 1;
    matchedCategory.songs.forEach((song) => {
        text = text.concat(` \n\n ${count})  ${song.name}`);
        count++
    });
    text = text.concat("\n \u200b ");
    const categorySongsEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${matchedCategory.emoji}  Sounds for ${matchedCategory.name} category: `)
        .setDescription(text)
        .addFields(`To play a specific sound type: `, ` \`\`\` ${getCommandWithPrefix("play [sound_name]")} \`\`\` or \`\`\` ${getCommandWithPrefix("play [category_name] [sound_index]")} \`\`\``)
    return categorySongsEmbed;
}

export function listCategories() {
    let text = "";
    categories.forEach((category) => {
        text = text.concat(` \n\n ${category.emoji} \u200b ${category.name}`)
    })
    text = text.concat("\n \u200b ");
    const categoryEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Sound Categories')
        .setDescription(text)
        .addField(`To see sounds within a category type: `, ` \`\`\` ${getCommandWithPrefix("categories [category_name]")} \`\`\` `)
    return categoryEmbed;
}
*/


/*
export function listInvalidCommand(command) {
    const invalidEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Invalid Command!')
        .setDescription(`/${command} is an invalid command`)
        // .addFields([`To see all commands, please type: `, ` \`\`\` ${getCommandWithPrefix("commands")} \`\`\` `])
    return invalidEmbed;
}

export function listHelpSettings() {
    let text = '📄 [Click Here](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-3) to View All Commands \n\n 🛠 Need Help? Please visit our [Troubleshooting page](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-6). \n\n 🌌 New to Ambience? [Join our community](https://discord.gg/w3Tp9x88Nw) \n';
    let queueCommands = getCommandsForCategory("queue");
    let queueText = "";
    queueCommands.forEach((command) => queueText = queueText.concat(` - ${command.command} \n`));
    let musicText = "";
    let musicCommands = getCommandsForCategory("music");
    musicCommands.forEach((command) => musicText = musicText.concat(` - ${command.command} \n`));
    let settingsText = "";
    let settingsCommands = getCommandsForCategory("settings");
    settingsCommands.forEach((command) => settingsText = settingsText.concat(` - ${command.command} \n`));
    let soundText = "";
    let soundCommands = getCommandsForCategory("sound");
    soundCommands.forEach((command) => soundText = soundText.concat(` - ${command.command} \n`));

    const helpEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ambience Help')
        .setDescription(text)
        .addFields(
            {name: "\n \n \n 🎵  Music Commands", value: musicText},
            {name: "\n 🔊  Sound Commands", value: soundText},
            {name: "\n 🎶  Queue Settings", value: queueText},
            {name: "\n 🤖  Bot Settings", value: settingsText}
        )
    return helpEmbed;
}

export function listAllSounds(sounds) {
    let text = ""

    for (let i = 0; i < sounds.length; i++) {
        if (sounds[i]) {
            text = text.concat(`\`${i + 1})\` ${sounds[i].name} \n`);
        }
    }

    const soundsEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Sounds: ')
        .setDescription(text)
        .addFields({
            name: 'To play a sound type: ',
            value: ` \`\`\`${getCommandWithPrefix("play [sound_name]")} \`\`\` `
        });
    return soundsEmbed;
}

*/

export function listSongInformation(song: Song) {
    const songInfoEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('⚙️ Ambience Settings')
        .setDescription("Use the command ``$command [option_name]`` to see more information about the option. \n")
        .setURL('https://discord.js.org/')
        .addFields(
            {
                name: '\n 📄 View Commands \u200B',
                value: ` \`\`\` ${getCommandWithPrefix("commands")} \`\`\` `,
                inline: true
            },
            {name: '❓ Get Help', value: ` \`\`\` ${getCommandWithPrefix("command help")} \`\`\` `, inline: true},
            {
                name: '🔈 Set Volume \u200B',
                value: ` \`\`\` ${getCommandWithPrefix("command setVolume")} \`\`\` `,
                inline: true
            },
            {
                name: '\n 🔍 FAQ and Support',
                value: 'Please join the [Ambience server](https://discord.gg/w3Tp9x88Nw) for support'
            },
        )
    return songInfoEmbed;
}

export function listValidPrefixes() {
    let text = "Invalid Prefix. Please use one of the following prefixes:";
    let validPrefixes = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '\\', '/', '.', '~'];
    for (let i = 0; i < validPrefixes.length; i++) {
        text = text.concat(`\n ${i + 1})  ${validPrefixes[i]}`)
    }
    return text;
}

export function getCommandInfo(command: Command) {
    const commandInfoEmbed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`The **${command.name}** command: `)
        .setDescription(command.description)
        .addFields(
            {name: 'To use the command, type: ', value: `\`\`${getCommandWithPrefix(command.usage)}\`\``},
        )
    return commandInfoEmbed;
}
