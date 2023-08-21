import {Events, GatewayIntentBits, PermissionsBitField, TextChannel} from 'discord.js';
import {getVoiceConnection} from '@discordjs/voice';
import {ActivityType, ChannelType} from 'discord-api-types/v10';
import {getInvalidCommandEmbed, getInviteEmbed, getWarningEmbed} from './scripts/getEmbeds';
import {AmbienceClient} from "./interfaces/AmbienceClient";
import {getAllCommands, getRandomSound} from "./utils";

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
        await interaction.reply({embeds: [getInvalidCommandEmbed(interaction.commandName)], ephemeral: true});
        return;
    }

    try {
        await command.execute(interaction, bot);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({embeds: [getWarningEmbed("Execution Error", "There was an error while executing this command")], ephemeral: true});
        } else {
            await interaction.reply({embeds: [getWarningEmbed("Execution Error", "There was an error while executing this command")], ephemeral: true});
        }
    }
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
                    name: getRandomSound().title,
                    type: ActivityType.Listening
                }
            ]
        });
    } else {
        throw Error("Bot user is undefined");
    }
});

// noinspection JSIgnoredPromiseFromCall
bot.login(configToken);
