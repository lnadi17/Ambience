import {Events, GatewayIntentBits, PermissionsBitField, TextChannel} from 'discord.js';
import {getVoiceConnection} from '@discordjs/voice';
import {ActivityType, ChannelType} from 'discord-api-types/v10';
import {getInviteEmbed} from './scripts/getEmbeds';
import {AmbienceClient} from "./types/AmbienceClient";
import {getAllCommands} from "./utils";

require('dotenv').config();

const configToken = process.env.TOKEN;
const bot = new AmbienceClient({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});

// Load all commands and attach them to the bot
getAllCommands().then((commands) => {
    commands.forEach((command) => {
        bot.commands.set(command.data.name, command);
    })
}).catch(error => console.log("Error while loading commands:", error));

// Disconnect the voice connection if no one is in the channel
bot.on(Events.VoiceStateUpdate, (oldState) => {
    if (oldState.channel?.members.size === 1) {
        getVoiceConnection(oldState.guild.id)?.destroy();
    }
});

// Handle slash command interactions
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

    // switch (command) {
    //     case 'pause':
    //         let chosenSong = bot.player.pause(message);
    //         if (chosenSong) {
    //             message.channel.send(`⏸ **${getProperSoundContent(chosenSong)}** was paused!`);
    //         }
    //         break;
    //
    //     case 'random':
    //         let randomSound = getRandomSound();
    //         message.content = `!play ${randomSound.link}`
    //         playAmbienceSong(message, args, randomSound.link);
    //         break;

    //     case 'resume':
    //         let chosenSong2 = bot.player.resume(message);
    //         if (chosenSong2) {
    //             message.channel.send(`⏯ **${getProperSoundContent(chosenSong2)}** was resumed!`);
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
    // }
});

// Handle play command autocomplete
bot.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isAutocomplete()) return;

    const command = (interaction.client as AmbienceClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.autocomplete(interaction);
    } catch (error) {
        console.error(error);
    }
});

// Post a message when added to a server
bot.on(Events.GuildCreate, guild => {
    const channel: TextChannel | undefined = guild.channels.cache.find(channel => {
        const botHasSendMessagePermissions = guild.members.me!.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages);
        return channel.type === ChannelType.GuildText && botHasSendMessagePermissions;
    }) as TextChannel;

    if (channel) {
        // noinspection JSIgnoredPromiseFromCall
        channel.send({embeds: [getInviteEmbed()]});
    }
});

// Log when the bot is ready
bot.on(Events.ClientReady, () => {
    console.log("🎶 I am ready to Play 🎶");
    if (bot.user) {
        bot.user.setStatus('online')
        bot.user.setPresence({
            activities: [
                {
                    name: 'your mom',
                    type: ActivityType.Watching
                }
            ]
        });
    } else {
        throw Error("Bot user is undefined");
    }
});

// noinspection JSIgnoredPromiseFromCall
bot.login(configToken);
