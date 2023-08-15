import {Events, GatewayIntentBits, PermissionsBitField, TextChannel} from 'discord.js';
import * as path from 'path';
import {join} from 'path';
import {getVoiceConnection, NoSubscriberBehavior} from '@discordjs/voice';
import {ActivityType, ChannelType} from 'discord-api-types/v10';
import {getInviteEmbed} from './scripts/getEmbeds';
import {AmbienceClient} from "./types/AmbienceClient";
import * as fs from "fs";
import {Command} from "./types/Command";
import {attachRecorder, getAllCommands} from "./utils";

require('dotenv').config();

const configToken = process.env.TOKEN;
const bot = new AmbienceClient({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});

// Load all commands and attach them to the bot
getAllCommands().then((commands) => {
    commands.forEach((command) => {
        bot.commands.set(command.data.name, command);
    })
}).catch(error => console.log("Error while loading commands:", error));

bot.on(Events.VoiceStateUpdate, (oldState, newState) => {
    // Disconnect from voice channel if no one is in it
    if (oldState.channel?.members.size === 1) {
        const connection = getVoiceConnection(oldState.guild.id);
        connection?.destroy()
    }
});

bot.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as AmbienceClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, bot);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
    // if (getKeyWord('help', message.content) || getKeyWord('command', message.content)) {
    // if (interaction.commandName === 'help') {
    //     if (commands.includes()) {
    //         message.channel.send(getCommandInfo(getCommandByName(content)));
    //
    //     } else {
    //         message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    //     }
    //
    //     return;
    // }

    // if (interaction.commandName === 'categories') {
    //     // check categories - compile early
    //     if (matchCategoryByName(content)) {
    //         message.channel.send(listCategorySongs(content));
    //         return;
    //     }
    //     message.channel.send("Category not found for " + content + ". \n Type `" + getCommandWithPrefix('commands') + "` to see all available categories");
    //     return;
    // }

    //
    //
    // if (getKeyWord('custom', message.content)) {
    //     playCustomSong(message, refineContent(message.content));
    // }
    //
    // if (getKeyWord('easter', message.content)) {
    //     let content = refineContent(message.content);
    //     playCustomSong(message, listEasterEggContent(content));
    //     return;
    // }

    // if (getKeyWord('play', message.content)) {

    //   return;
    // }

    // if (getKeyWord(('setvolume'), message.content)) {
    //     let content = message.content.split(" ")[1];
    //     let contentArray = message.content.split(" ");
    //     let refinedContent = contentArray.slice(1, contentArray.length);
    //     content = refinedContent.join(" ");
    //     try {
    //         let isDone = await bot.player.setVolume(message, parseInt(content));
    //         if (isDone)
    //             message.channel.send(`🔊 Volume set to ${args[0]}!`);
    //     } catch (err) {
    //         console.log("something went wrong");
    //         message.channel.send("❌ You must play a sound to use this command.");
    //     }
    //
    //
    //     return;
    // }
    //
    // if (getKeyWord(('search'), message.content)) {
    //     message.channel.send(listSearchResults(soundSearch(message.content)));
    //     return;
    // }
    //
    // if (getKeyWord(('prefix'), message.content)) {
    //     let content = refineContent(message.content);
    //     let validPrefixes = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '\\', '/', '.', '~'];
    //     if (!validPrefixes.includes(content)) {
    //         message.channel.send(listValidPrefixes());
    //         return;
    //     }
    //     process.env.PREFIX = content;
    //     message.channel.send(`✅ Prefix set to ${content}`);
    // }
    //
    // if (getKeyWord(('settings'), message.content)) {
    //     let content = refineContent(message.content);
    //     return;
    // }
    //
    // switch (command) {
    //     case 'help':
    //         message.channel.send(listHelpSettings());
    //         break;
    //
    //     case 'settings':
    //         message.channel.send(listSettings());
    //         break;
    //
    //     case 'commands':
    //         message.channel.send(listCommands());
    //         break;
    //
    //     case 'categories':
    //         message.channel.send(listCategories());
    //         break;
    //
    //     case 'pause':
    //         let chosenSong = bot.player.pause(message);
    //         if (chosenSong) {
    //             message.channel.send(`⏸ **${getProperSoundContent(chosenSong)}** was paused!`);
    //         }
    //         break;
    //
    //     case 'sounds':
    //         message.channel.send(listAllSounds(getAllSounds()));
    //         break;
    //
    //     case 'random':
    //         let randomSound = getRandomSound();
    //         message.content = `!play ${randomSound.link}`
    //         playAmbienceSong(message, args, randomSound.link);
    //         break;
    //
    //     case 'playlist':
    //         playPlaylist(message, args)
    //         break;
    //
    //     case 'resume':
    //         let chosenSong2 = bot.player.resume(message);
    //         if (chosenSong2) {
    //             message.channel.send(`⏯ **${getProperSoundContent(chosenSong2)}** was resumed!`);
    //         }
    //         break;
    //
    //     case 'skip':
    //         let chosenSong3 = bot.player.skip(message);
    //         if (chosenSong3) {
    //             message.channel.send(`👉 **${getProperSoundContent(chosenSong3)}** was skipped!`);
    //         }
    //         break;
    //
    //     case 'stop':
    //         let isComplete = bot.player.stop(message);
    //         if (isComplete) {
    //             message.channel.send('🛑 Sounds stopped, the Queue has been cleared');
    //         }
    //         break;
    //
    //     case 'loop':
    //         let toggle = bot.player.toggleLoop(message);
    //         if (toggle === null) return;
    //         else if (toggle) message.channel.send(`🔁 ${getProperSoundContent(song)} is now on loop`)
    //         else message.channel.send(`✋ **${getProperSoundContent(song)}** will no longer be on loop`)
    //         break;
    //
    //     case 'progress':
    //         let progressBar = bot.player.createProgressBar(message, {
    //             size: 40,
    //             block: '\u2588',
    //             arrow: '\u2591'
    //         });
    //         if (progressBar)
    //             message.channel.send(progressBar);
    //         break;
    //
    //     case 'repeatqueue':
    //         let status = bot.player.setQueueRepeatMode(message, true);
    //         if (status === null)
    //             break;
    //         message.channel.send(`🔁 Queue will be repeated!`);
    //         break;
    //
    //
    //     case 'disablerepeatqueue':
    //         let result = bot.player.setQueueRepeatMode(message, false);
    //         if (result === null)
    //             break;
    //         message.channel.send(`✋ Queue will not be longer repeated!`);
    //         break;
    //
    //     case 'remove':
    //         let songID = parseInt(args[0]) - 1;
    //
    //         let chosenSong4 = bot.player.remove(message, songID);
    //         if (chosenSong4)
    //             message.channel.send(`🗑 Removed song **${getProperSoundContent(chosenSong4)}** (${args[0]}) from the Queue!`);
    //         break;
    //
    //     case 'shuffle':
    //         let songs = bot.player.shuffle(message);
    //         if (songs)
    //             message.channel.send('🔀 Server Queue was shuffled.');
    //         break;
    //
    //
    //     case 'queue':
    //         let queue = bot.player.getQueue(message);
    //         if (queue)
    //             message.channel.send(getQueueEmbed(queue.songs));
    //         break;
    //
    //     case 'resume':
    //         let chosenSong5 = client.player.resume(message);
    //         if (chosenSong5) {
    //             message.channel.send(`⏯ **${getProperSoundContent(chosenSong5.name)}** was resumed!`);
    //         }
    //         break;
    //
    // }
});

// Post a message when added to a server
bot.on(Events.GuildCreate, guild => {
    const channel: TextChannel | undefined = guild.channels.cache.find(channel => {
        const botHasSendMessagePermissions = guild.members.me!.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages);
        return channel.type === ChannelType.GuildText && botHasSendMessagePermissions;
    }) as TextChannel;

    if (channel) {
        channel.send({embeds: [getInviteEmbed()]});
    }
});

// Log when the bot is ready
bot.on(Events.ClientReady, () => {
    console.log("🎶 I am ready to Play 🎶");
    attachRecorder(bot.player);

    bot.user!.setStatus('online')
    bot.user!.setPresence({
        activities: [
            {
                name: 'your mom',
                type: ActivityType.Watching
            }
        ]
    });
});

bot.login(configToken);
