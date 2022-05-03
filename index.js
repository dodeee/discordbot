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
const Addit = require('./commands/addit')
const Report = require('./commands/report')
const Search = require('./commands/search')
const Skip = require('./commands/skip')
const Skiplist = require('./commands/skiplist')
const BD = require('./model/BD')
const Radio = require('./Radio')
const Askfor = require('./commands/askfor')
const Leaderboard = require('./commands/leaderbord')
const CONSTS = require('./data/consts')



BD.BDConnect();
BD.getAllUsers().then(res =>{
    console.log("resprom : "+res);
});
//BD.deleteUserById(361979066951270400);
//BD.deleteAllUsers()



var commands = [Start, Play, Pause, Next, Stop, Voteskip, Votelist, Playlists, Me, Leaderboard, Setlist, Search, Report, Skip, Skiplist, Addit, Askfor, Help];
Radio.voiceChanId = CONSTS.radioVoiceChan
Radio.setCommands(commands)
bot.on('message', function(message){
    if(message.channel.id == CONSTS.radioTxtChan){//639485992952397827
        if(Reply.messager == 0){
            Reply.setMessager(message.channel)
        }
        // let reg = /^[!a-zA-Z0-9\s]+$/

        // if(message.content.startsWith('!') && reg.test(message.content)){
            //console.log("commande")
            // if(Help.parse(message)){
            //     var infos = "";
            //     commands.forEach(element => {
            //         infos+=  " -- " +element.getName() + element.getHelpInfo()+ '\n';
            //     });
            //     Reply.sayEmbedWithTitle("Existing commands information",infos);
            // } else {
                i=0;
                found = false;
                while(i < commands.length && !found){
                    found = commands[i].parse(message);
                    i++;
                }
           // }
        } else{
            //console.log("pas commande")
        }
    //}
});
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID;
    
    if(newUserChannel === CONSTS.radioVoiceChan && newMember.id !== '793844954891943966') //don't user joined the channel and isnt the bot
    { 
        // User Joins a voice channel
        console.log("Joined vc with id "+ newMember);
        Radio.userJoined(newMember)
    }
    else{
        console.log("Left vc");

    }
 });
bot.login(CONSTS.radioToken);