const Discord = require('discord.js')
const bot = new Discord.Client()
const Start = require('./commands/start')
const Play = require('./commands/play')
const Pause = require('./commands/pause')
const Next = require('./commands/next')
const Stop = require('./commands/stop')
const Voteskip = require('./commands/voteskip')
const Votelist = require('./commands/votelist')
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
const Radio = require('./Radio')
const Addit = require('./commands/addit')
const Askfor = require('./commands/askfor')
const Blindtest = require('./blindtest')
const Leaderboard = require('./commands/leaderbord')
const CONSTS = require('./data/consts')


BD.BDConnect();
BD.getAllUsers().then(res =>{
    console.log("resprom : "+res);
});
//BD.addOneHourToUser('269522121779052544', 33)
// BD.setRole('223537878662119424', 0)
// BD.setRole('361979066951270422', 0)
console.log("NOUVEAU BLABLABOT")
// BD.deleteUserById(361979066951270400);
// BD.deleteAllUsers()

var commands = [Start, Play, Pause, Next, Stop, Voteskip, Votelist, Playlists, Me, Leaderboard, Setlist, RadioMode, BlindtestMode, Search, Report, Addit, Askfor, Help];
Radio.setCommands(commands)
Radio.voiceChanId = CONSTS.blablaVoiceChan
Radio.blindtest = true
bot.on('message', function(message){
    if(message.channel.id == CONSTS.blablaTxtChan){//639485992952397827
        if(Reply.messager == 0){
            Reply.setMessager(message.channel)
        }
        if(Blindtest.isBlindtestAnswer && message.member.user.id.toString() !== '966335642676129884'){
            Blindtest.readBlindtestAnswer(message)
        } 
        i=0;
        found = false;
        while(i < commands.length && !found){
            found = commands[i].parse(message);
            i++;
        }
    } 
});

bot.login(CONSTS.blablaToken);