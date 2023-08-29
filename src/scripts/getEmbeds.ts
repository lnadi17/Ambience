import {EmbedBuilder} from "discord.js";
import {Command} from "../types/Command";
import categories from "../data/categories";
import {getCommandsForCategory} from "../utils";
import {CommandCategory} from "../interfaces/CommandCategory";
import {SongCategory} from "../types/SongCategory";

export function getInviteEmbed() {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Thanks for Inviting Ambience!')
        .setDescription(`Use the command \`/help\` to see all commands. \n \
         For more information please visit the [Ambience Website](https://lnadi17.github.io/Ambience/). \
         Please consider joining our [Discord server](https://discord.com/invite/w3Tp9x88Nw) \
         to meet people within our community. \n`)
        .addFields([
            {name: '\n \n 🎶 View Sounds', value: ` \`\`\` /sounds \`\`\``, inline: true},
            {
                name: '🎙 View Sound Categories',
                value: ` \`\`\` /categories \`\`\``,
                inline: true
            },
            {name: '❓ Get Help', value: `\`\`\` /help [command] \`\`\``, inline: true},
            {
                name: '\n 🔍 FAQ and Support',
                value: 'Please join the [Ambience server](https://discord.gg/w3Tp9x88Nw) for support'
            },
        ]);
}

export async function getHelpEmbed() {
    let text =
        '📄 [Click Here](https://lnadi17.github.io/Ambience/website/docs.html#section-3) to View All Commands \n\n ' +
        '🛠 Need Help? Please visit our [Troubleshooting page](https://lnadi17.github.io/Ambience/website/docs.html#section-6) \n\n ' +
        '🌌 New to Ambience? [Join our community](https://discord.gg/w3Tp9x88Nw) \n\n';
    let musicText = "";
    let musicCommands = await getCommandsForCategory(CommandCategory.Sound);
    musicCommands.forEach((command) => musicText = musicText.concat(` Command: **${command.data.name}** \n Description: **${command.data.description}** \n Usage: \`${command.usage.join("` or `")}\` \n\n`));
    let informationText = "";
    let settingsCommands = await getCommandsForCategory(CommandCategory.Info);
    settingsCommands.forEach((command) => informationText = informationText.concat(` **${command.data.name}** \n Description: **${command.data.description}** \n Usage: \`${command.usage.join("` or `")}\` \n\n`));

    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ambience Help')
        .setDescription(text)
        .addFields(
            {name: "\n 🔊  Sound Commands", value: musicText},
            {name: "\n 🤖  Bot Information", value: informationText}
        )
}

export function getCategorySoundsEmbed(categoryName: string) {
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
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${category.emoji}  Sounds for ${category.name} category: `)
        .setDescription(text)
        .addFields({
            name: `To play a specific sound type: `,
            value: ` \`\`\` /play [sound_name] \`\`\``
        });
}

export function getCategoriesEmbed() {
    let text = "";
    categories.forEach((category) => {
        text = text.concat(` \n\n ${category.emoji} \u200b ${category.name}`)
    })
    text = text.concat("\n \u200b ");
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Sound Categories')
        .setDescription(text)
        .addFields({
            name: `To see sounds within a category type: `,
            value: ` \`\`\` /categories [category_name] \`\`\` `
        });
}


export function getInvalidCommandEmbed(command) {
    return new EmbedBuilder()
        .setColor('#f6c210')
        .setTitle(`⚠️ Invalid Command ⚠️`)
        .setDescription(`/${command} is an invalid command`)
        .addFields([{name: `To see all commands, please type: `, value: ` \`\`\` /help \`\`\``}]);
}

export function getAllSoundsEmbed() {
    let text = ""

    categories.forEach((category) => {
        const sounds = category.songs;
        text = text.concat(`\n ${category.emoji} **${category.name}** \n`);
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i]) {
                text = text.concat(`\`${i + 1})\` ${sounds[i].title} \n`);
            }
        }
    });

    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Sounds: ')
        .setDescription(text)
        .addFields({
            name: 'To play a sound type: ',
            value: ` \`\`\` /play [sound_name] \`\`\` `
        });
}


export function getCommandInfoEmbed(command: Command) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`The **${command.data.name}** command: `)
        .setDescription(command.data.description)
        .addFields(
            {name: 'To use the command, type: ', value: `${command.usage.map(x => `\`\`\`${x}\`\`\``).join("or")}`},
        );
}

export function getPlayEmbed(sound: string) {
    let text = `▶️ **Now Playing:** ${sound} \n`;

    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Radio 🎶')
        .setDescription(text);
}

export function getRandomEmbed(text: string, randomColor: boolean = false) {
    return new EmbedBuilder()
        .setColor(randomColor ? "Random" : '#0099ff')
        .setTitle('🎲 Ambience Radio 🎲')
        .setDescription(text);
}

export function getPlayErrorEmbed(sound: string) {
    let text = `❌ **Error Playing:** ${sound} \n`;

    return new EmbedBuilder()
        .setColor('#e50a07')
        .setTitle('🎶 Ambience Radio 🎶')
        .setDescription(text);
}

export function getWarningEmbed(title, text: string) {
    return new EmbedBuilder()
        .setColor('#f6c210')
        .setTitle(`⚠️ ${title} ⚠️`)
        .setDescription(text);
}

export function getStopEmbed() {
    let text = `🔌 **Successfully Disconnected** \n`;

    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Radio 🎶')
        .setDescription(text);
}

export function getPlaySoundEmbed(category: SongCategory) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Radio 🎶')
        .setDescription(`Please select a sound from ${category.name}`)
}

export function getPlayComponentsEmbed() {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎶 Ambience Radio 🎶')
        .setDescription("Please select a category")
}

