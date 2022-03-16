const Discord = require('discord.js')
const bot = new Discord.Client()
const Start = require('./commands/start')
const Play = require('./commands/play')
const Pause = require('./commands/pause')
const Next = require('./commands/next')
const Stop = require('./commands/stop')
const Voteskip = require('./commands/voteskip')
const Playlists = require('./commands/playlists')
const Me = require('./commands/me')
const Help = require('./commands/help')
const Reply = require('./reply')
const Genre = require('./commands/genre')
const RadioMode = require('./commands/radiomode')
const BlindtestMode = require('./commands/blindtestmode')
const BD = require('./model/BD')

BD.BDConnect();

BD.getAllUsers().then(res =>{
    console.log("resprom : "+res);
});

//BD.deleteUserById(223537878662119420);

var commands = [Start, Play, Pause, Next, Stop, Voteskip, Playlists, Me, Genre, RadioMode, BlindtestMode];

bot.on('message', function(message){
    if(Reply.messager == 0){
        Reply.setMessager(message.channel)
    }

    if(Help.parse(message)){
        var infos = "Cmd info";
        commands.forEach(element => {
            infos+=  " -- " +element.getName();
        });
        Reply.say(infos);
    } else {
        i=0;
        found = false;
        while(i < commands.length && !found){
            found = commands[i].parse(message);
            i++;
        }
    }
});


bot.login('NzkzODQ0OTU0ODkxOTQzOTY2.X-yLug.5tvjYRmz6SCijp4IXJRgP3xjaeE');