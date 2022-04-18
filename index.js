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
const Setlist = require('./commands/setlist')
const RadioMode = require('./commands/radiomode')
const BlindtestMode = require('./commands/blindtestmode')
const Report = require('./commands/report')
const Search = require('./commands/search')
const BD = require('./model/BD')


BD.BDConnect();


BD.getAllUsers().then(res =>{
    console.log("resprom : "+res);
});

//BD.deleteUserById(361979066951270400);



console.log(bot.channels)
var commands = [Start, Play, Pause, Next, Stop, Voteskip, Playlists, Me, Setlist, RadioMode, BlindtestMode, Search, Report];

bot.on('message', function(message){
    if(message.channel.id == 639485992952397827){//639485992952397827
        if(Reply.messager == 0){
            Reply.setMessager(message.channel)
        }
        let reg = /^[!a-zA-Z0-9\s]+$/

        if(message.content.startsWith('!') && reg.test(message.content)){
            console.log("commande")
            if(Help.parse(message)){
                var infos = "";
                commands.forEach(element => {
                    infos+=  " -- " +element.getName() + element.getHelpInfo()+ '\n';
                });
                Reply.sayEmbedWithTitle("Existing commands information",infos);
            } else {
                i=0;
                found = false;
                while(i < commands.length && !found){
                    found = commands[i].parse(message);
                    i++;
                }
            }
        } else{
            //console.log("pas commande")
        }
    }
});


bot.login('NzkzODQ0OTU0ODkxOTQzOTY2.X-yLug.hpIBSvLP5uF-gQfU7P48-MMobi0');