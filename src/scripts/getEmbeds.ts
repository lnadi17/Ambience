import {getCommandWithPrefix} from "./getCommands";
import * as Discord from "discord.js";
import {Command} from "../types/Command";
import categories from "../data/categories";
import {AmbienceClient} from "../types/AmbienceClient";

// const categories = songsData.categories;
// const sounds = getSongsFromData(categories);

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

export function getHelpEmbed(bot: AmbienceClient) {
    let text = "Here is a list of my commands: ";
    bot.commands.forEach((command) => {
        text = text.concat(` \n - ${command.data.name}`)
    });
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ambience Commands')
        .setDescription(text)
        .addFields({
            name: `To get more information about a specific command type: `,
            value: ` \`\`\` ${getCommandWithPrefix("help [command_name]")} \`\`\` `
        })
}

export function listCategorySongs(categoryName: string) {
    let category = categories.find((category) => category.name === categoryName);
    if (!category) {
        throw new Error(`Category ${categoryName} not found`);
    }

    let count = 1;
    let text = "";
    category.songs.forEach((song) => {
        text = text.concat(` \n\n ${count})  ${song.title}`);
        count++
    });
    text = text.concat("\n \u200b ");
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${category.emoji}  Sounds for ${category.name} category: `)
        .setDescription(text)
        .addFields({
            name: `To play a specific sound type: `,
            value: ` \`\`\` ${getCommandWithPrefix("play [sound_name]")} \`\`\``
        });
}

export function listCategories() {
    let text = "";
    categories.forEach((category) => {
        text = text.concat(` \n\n ${category.emoji} \u200b ${category.name}`)
    })
    text = text.concat("\n \u200b ");
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Sound Categories')
        .setDescription(text)
        .addFields({
            name: `To see sounds within a category type: `,
            value: ` \`\`\` ${getCommandWithPrefix("categories [category_name]")} \`\`\` `
        });
}


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
            {name: "\n 🤖  Bot Settings", value: settingsText}
        )
    return helpEmbed;
}

*/
export function listAllSounds() {
    const sounds = categories.map((category) => category.songs).flat();
    let text = ""

    for (let i = 0; i < sounds.length; i++) {
        if (sounds[i]) {
            text = text.concat(`\`${i + 1})\` ${sounds[i].title} \n`);
        }
    }

    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Sounds: ')
        .setDescription(text)
        .addFields({
            name: 'To play a sound type: ',
            value: ` \`\`\`${getCommandWithPrefix("play [sound_name]")} \`\`\` `
        });
}


export function getCommandInfo(command: Command) {
    return new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`The **${command.data.name}** command: `)
        .setDescription(command.data.description)
        .addFields(
            {name: 'To use the command, type: ', value: `\`\`${command.usage}\`\``},
        );
}
