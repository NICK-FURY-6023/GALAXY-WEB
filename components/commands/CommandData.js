// components/commands/CommandData.js

// Ye user-facing commands hain
const miscellaneous = [
    { cmd: 'about', desc: 'Show bot information.', usage: 'about' },
    { cmd: 'fixfavs', desc: 'Repair favorite list.', usage: 'fixfavs' },
    { cmd: 'help', desc: 'Shows the help menu.', usage: 'help [command_name]' },
    { cmd: 'invite', desc: 'Get the bot\'s invite link.', usage: 'invite' },
    { cmd: 'lastfm', desc: 'Link your Last.fm account.', usage: 'lastfm set <username>' },
    { cmd: 'panel', desc: 'Show the music control panel.', usage: 'panel' },
    { cmd: 'resetprefix', desc: 'Resets the command prefix.', usage: 'resetprefix' },
    { cmd: 'resetuserprefix', desc: 'Resets your personal prefix.', usage: 'resetuserprefix' },
    { cmd: 'servers', desc: 'Shows the bot\'s server list.', usage: 'servers' },
    { cmd: 'setguildprefix', desc: 'Sets a new prefix for the server.', usage: 'setguildprefix <prefix>' },
    { cmd: 'setprefix', desc: 'Alias for setguildprefix.', usage: 'setprefix <prefix>' },
    { cmd: 'setuserprefix', desc: 'Sets a personal prefix for you.', usage: 'setuserprefix <prefix>' },
    { cmd: 'summon', desc: 'Makes the bot join your VC.', usage: 'summon' },
    { cmd: 'updatelog', desc: 'Shows the latest bot updates.', usage: 'updatelog' },
];

const music = [
    { cmd: '247', desc: 'Toggles 24/7 mode.', usage: '247' },
    { cmd: 'adddj', desc: 'Grants DJ privileges to a user.', usage: 'adddj <@user>' },
    { cmd: 'addposition', desc: 'Add a song at a specific position.', usage: 'addposition <num> <song>' },
    { cmd: 'autoplay', desc: 'Toggles autoplay.', usage: 'autoplay' },
    { cmd: 'back', desc: 'Plays the previous song.', usage: 'back' },
    { cmd: 'clear', desc: 'Clear the music queue.', usage: 'clear' },
    { cmd: 'controller', desc: 'Shows the music controller.', usage: 'controller' },
    { cmd: 'favmanager', desc: 'Manages your favorite songs.', usage: 'favmanager' },
    { cmd: 'loop', desc: 'Cycles through loop modes.', usage: 'loop' },
    { cmd: 'move', desc: 'Moves a song to a different position.', usage: 'move <from> <to>' },
    { cmd: 'nightcore', desc: 'Applies the nightcore filter.', usage: 'nightcore' },
    { cmd: 'nowplaying', desc: 'Show the currently playing song.', usage: 'nowplaying' },
    { cmd: 'pause', desc: 'Pause the music.', usage: 'pause' },
    { cmd: 'play', desc: 'Plays a song or playlist.', usage: 'play <song_or_url>' },
    { cmd: 'playeruptime', desc: 'Shows player uptime.', usage: 'playeruptime' },
    { cmd: 'queue', desc: 'Display the song queue.', usage: 'queue' },
    { cmd: 'readd', desc: 'Re-adds a finished song to the queue.', usage: 'readd' },
    { cmd: 'remove', desc: 'Remove a song from the queue.', usage: 'remove <song_number>' },
    { cmd: 'restrictmode', desc: 'Toggle restrict mode.', usage: 'restrictmode' },
    { cmd: 'resume', desc: 'Resume the paused music.', usage: 'resume' },
    { cmd: 'reverse', desc: 'Reverse the queue.', usage: 'reverse' },
    { cmd: 'rotate', desc: 'Rotate the queue.', usage: 'rotate' },
    { cmd: 'savequeue', desc: 'Saves the current queue.', usage: 'savequeue <playlist_name>' },
    { cmd: 'search', desc: 'Searches for a song.', usage: 'search <song_name>' },
    { cmd: 'seek', desc: 'Seek to a specific time.', usage: 'seek <HH:MM:SS>' },
    { cmd: 'setvoicestatus', desc: 'Sets the bot\'s voice status.', usage: 'setvoicestatus <status>' },
    { cmd: 'shuffle', desc: 'Shuffle the queue.', usage: 'shuffle' },
    { cmd: 'skip', desc: 'Skip the current song.', usage: 'skip' },
    { cmd: 'songrequestthread', desc: 'Creates a song request thread.', usage: 'songrequestthread' },
    { cmd: 'stop', desc: 'Stop the music.', usage: 'stop' },
    { cmd: 'volume', desc: 'Adjust the music volume.', usage: 'volume <0-200>' },
];

const settings = [
    { cmd: 'adddjrole', desc: 'Assigns DJ privileges to a role.', usage: 'adddjrole <@role>' },
    { cmd: 'changeskin', desc: 'Changes the bot\'s appearance.', usage: 'changeskin' },
    { cmd: 'customskin', desc: 'Applies a custom skin.', usage: 'customskin' },
    { cmd: 'listenalong', desc: 'Syncs playback with a user.', usage: 'listenalong' },
    { cmd: 'nodeinfo', desc: 'Shows Lavalink node info.', usage: 'nodeinfo' },
    { cmd: 'playersettings', desc: 'Configure player settings.', usage: 'playersettings' },
    { cmd: 'removedjrole', desc: 'Removes DJ privileges from a role.', usage: 'removedjrole <@role>' },
    { cmd: 'reset', desc: 'Resets all bot settings.', usage: 'reset' },
    { cmd: 'richpresence', desc: 'Toggles rich presence.', usage: 'richpresence' },
    { cmd: 'setup', desc: 'Initializes the bot.', usage: 'setup' },
    { cmd: 'stageregion', desc: 'Sets the region for stage channels.', usage: 'stageregion' },
];

// --- UPDATED & COMPLETE DEVELOPER COMMANDS ---
export const devCommandData = [
    { cmd: 'cleardm', desc: 'Developer: Clear bot DMs.', usage: 'cleardm' },
    { cmd: 'commandlog', desc: 'Developer: View command logs.', usage: 'commandlog' },
    { cmd: 'exportsource', desc: 'Developer: Export config/data.', usage: 'exportsource' },
    { cmd: 'getlavaservers', desc: 'Developer: Show Lavalink nodes.', usage: 'getlavaservers' },
    { cmd: 'jishaku', desc: 'Developer: Run diagnostics.', usage: 'jishaku' },
    { cmd: 'reload', desc: 'Developer: Reloads the bot.', usage: 'reload' },
    { cmd: 'reloadconfig', desc: 'Developer: Reloads the config file.', usage: 'reloadconfig' },
    { cmd: 'reloadskins', desc: 'Developer: Reloads skins.', usage: 'reloadskins' },
    { cmd: 'restartlavalink', desc: 'Developer: Restarts the Lavalink node.', usage: 'restartlavalink' },
    { cmd: 'saveplayers', desc: 'Developer: Saves player states.', usage: 'saveplayers' },
    { cmd: 'setavatar', desc: 'Developer: Set the bot\'s avatar.', usage: 'setavatar <url>' },
    { cmd: 'setbanner', desc: 'Developer: Set the bot\'s banner.', usage: 'setbanner <url>' },
    { cmd: 'shell', desc: 'Developer: Execute shell commands.', usage: 'shell <command>' },
    { cmd: 'update', desc: 'Developer: Update the bot.', usage: 'update' },
    { cmd: 'updatelavalink', desc: 'Developer: Update Lavalink.', usage: 'updatelavalink' },
    { cmd: 'ytoauth', desc: 'Developer: Manage YouTube OAuth.', usage: 'ytoauth' },
].sort((a, b) => a.cmd.localeCompare(b.cmd)); // Alphabetically sorted

export const userCommandData = [
  { category: 'Music', commands: music.sort((a, b) => a.cmd.localeCompare(b.cmd)) },
  { category: 'Settings', commands: settings.sort((a, b) => a.cmd.localeCompare(b.cmd)) },
  { category: 'Miscellaneous', commands: miscellaneous.sort((a, b) => a.cmd.localeCompare(b.cmd)) },
];