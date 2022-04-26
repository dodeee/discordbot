const Library = require('./library')
const Reply = require('./reply')
const BD = require('./model/BD')
const Blindtest = require('./blindtest')


module.exports = class Radio {
    static state = 0
    static connection = 0
    static dispatcher = 0
    static voiceChan = 0
    static nbVoteskip = 0
    static blindtest = false;
    static currSong='';
    static commmands = []
    static nbVotelist = 0
    static voiceChanId = 0

    //////////////////////////////////////////////// RADIO COMMANDS ///////////////////////////////////////////////////////////////////////////

    static start(message) {
        
        console.log('vboice chan : '+this.voiceChanId)
        if (this.getState() === 0) {
            this.voiceChan = message.guild.channels.cache
            .filter(function (channel) { return channel.type == 'voice' && channel.id == Radio.voiceChanId }) // 639485992952397829
            .first()
            this.setPlaylistEveryHour()
           
            Reply.sayEmbedWithTitle("Welcome to RadioBot (type !help for command info)", '')
            if(this.blindtest) Reply.say("**Blindtest mode**")
            else Reply.say("**Radio mode**")
            this.setState(1)
            Library.createPlaylist()
            this.voiceChan.join()
                .then(function (con) {
                    Radio.connection = con
                    Radio.playNextFile()
                })
        }
        else {
            console.log("started")
        }
    }

    static next() {
        if (this.getState != 0 && !this.blindtest) {
            this.playNextFile()
            this.setState(1)
        }
    }

    static pause() {
        if (this.getState() === 1) {
            this.dispatcher.pause()
            this.setState(2)
        }
    }

    static play() {
        if (this.getState() === 2) {
            this.dispatcher.resume()
            this.setState(1)
        }
    }

    static stop() {
        if (this.voiceChan != 0) {
            this.voiceChan.leave()
            this.setState(0)
        }
    }

    static voteskip(){
        if(this.getState() != 0 && !this.blindtest){
            this.nbVoteskip+=1
            let mandatoryVoteskipNb = Math.ceil((this.voiceChan.members.size - 1)*0.6);
            Reply.say("Voteskip "+ this.nbVoteskip+" / "+ mandatoryVoteskipNb+" Necessary");
            if(this.nbVoteskip >= mandatoryVoteskipNb){
                Reply.say("Song skipped")
                this.playNextFile();
            }
        }
    }
    static votelist(message){
        console.log(message.content)
        if(this.getState!=0){
            let chosenListNum = message.content.split(' ')[1];
            if(chosenListNum !== undefined && (chosenListNum-1) >= 0 && (chosenListNum-1) < Library.getSongFolders().length){
                this.nbVotelist+=1
                let mandatoryVoteNb = Math.ceil((this.voiceChan.members.size - 1)*0.6);
                Reply.say("Votelist "+ this.nbVotelist+" / "+ mandatoryVoteNb+" Necessary");
                if(this.nbVotelist >= mandatoryVoteNb){
                    console.log(Library.getSongFolders()[chosenListNum-1])
                    this.nbVotelist=0
                    Reply.say("Playlist changed")
                    Library.setSongFolder(Library.getSongFolders()[chosenListNum-1]); 
                }
            } else {
                console.log("bad list choice")
            }
        }
    }
    
    static playlist(){
        if(this.getState!=0){
            var lists= '';
            Library.getSongFolders().forEach((element, index) => {
                lists+= (index+1)+' - ' + element.toUpperCase()+'\n';
            });
            Reply.sayEmbedWithTitle("Current playlist : \n"+Library.genre.toUpperCase()+"\n\nAvailable playlists : ", lists);
        }
    }
    
    static me(message){
        const id = message.member.user.id.toString()
        BD.getUserById(id).then(res =>{
            if(res){
                let channelPoints = res.nbCmds*10 + res.hoursSpent*100 - 500 * res.skips - 2500 * res.skiplists 
                var roleName = "unknown";
                if(res.role==0) roleName = "Admin";
                else if(res.role==1) roleName = "User";
                Reply.sayEmbedWithTitle("User: "+res.name+"\n","Chan Points: "+channelPoints+"\nBlindtestPoints: "+res.blindtestPoints+"\nRole: "+roleName);
            } else{
                console.log("UnknownUser");
            }
            
        })
        //.catch((error) => console.log("Promise error"));
    }

    static setBlindtest(val){
        this.blindtest=val;
        Blindtest.setBlindtestOn(val && this.getState() === 1)
        if(this.blindtest){
            Reply.say("**Blindtest mode**")
            if(this.getState() >0) this.playNextFile()
        }
            
        else {
            Reply.say("**Radio mode**")
            if(this.getState() >0) this.playNextFile()
        }
    }
    
   
    
    static setlist(message){
        console.log(message.content)
        if(this.getState!=0){
            let chosenListNum = message.content.split(' ')[1];
            if(chosenListNum !== undefined && (chosenListNum-1) >= 0 && (chosenListNum-1) < Library.getSongFolders().length){
                console.log(Library.getSongFolders()[chosenListNum-1])
                this.nbVotelist=0
                Library.setSongFolder(Library.getSongFolders()[chosenListNum-1]); 
            } else {
                console.log("bad list choice")
            }
        }
    }


    static report(message, commandLength){  
        if(this.getState() > 0 && this.currSong != ''){ // chanson en cours
            let logContent = Library.genre + '/'+this.currSong
            let reason = message.content.substr(commandLength)
            if(reason){
                logContent+=', '+reason
            }
            logContent+=', ' +new Date()+'\n'
            Library.writeFileData(logContent, './logs/report-logs.txt')
            Reply.say('Reported song : ' + this.currSong);
        } else{
            console.log("pas de chanson"+this.currSong)
        }
    }

    static search(message, commandLength){
        let search = message.content.substr(commandLength+1)
        if(search.length > 1){
            let foundResults = Library.searchSong(search)
            if(foundResults !== undefined && foundResults.length > 0){
                let resultMessage = ''
                foundResults.forEach(res => {
                    resultMessage+=res+'\n'
                });
                Reply.sayEmbedWithTitle( "Results",resultMessage)
            } else{
                Reply.say("Not found")
            }
        } else {
            Reply.say("Bad search")
        }

    }

    static skip(message){
        if(this.getState() != 0){
            const id = message.member.user.id.toString()
            BD.getUserById(id).then(user =>{
                if(user){
                    let channelPoints = user.nbCmds*10 + user.hoursSpent*100 - 500 * user.skips - 2500 * user.skiplists
                    if(channelPoints >= 500){
                        Reply.say(user.name+" skipped song for 500 Chan Points: ")
                        BD.addSkips(id, 1, 0)
                        this.playNextFile()
                    } else{
                        Reply.say(user.name+" not enough Chan Points ! ")
                        
                    }
                } else{
                    console.log("UnknownUser");
                }
                
            })
        }
    }

    static skiplist(message){
        
        if(this.getState() != 0){
            const id = message.member.user.id.toString()
            let chosenListNum = message.content.split(' ')[1];
            console.log("skip list to : "+ chosenListNum)
            if(chosenListNum !== undefined && (chosenListNum-1) >= 0 && (chosenListNum-1) < Library.getSongFolders().length){
                BD.getUserById(id).then(user =>{
                    if(user){
                        let channelPoints = user.nbCmds*10 + user.hoursSpent*100 - 500 * user.skips - 2500 * user.skiplists
                        if(channelPoints >= 2500){
                            Reply.say(user.name+" skipped playlist for 2500 Chan Points: ")
                            BD.addSkips(id, 0, 1)
                            console.log(Library.getSongFolders()[chosenListNum-1])
                            this.nbVotelist=0
                            Library.setSongFolder(Library.getSongFolders()[chosenListNum-1]);
                            this.playNextFile()
                        } else{
                            Reply.say(user.name+" not enough Chan Points ! ")
                            
                        }
                    } else{
                        console.log("UnknownUser");
                    }
                    
                })
            }
        }
    }
    static help(){
        let infos = "";
        this.commands.forEach(cmd => {
            if(cmd.name != '!help' && cmd.authorizedLevel != 0)
            infos+=  " -- " +cmd.getName() + cmd.getHelpInfo()+ '\n';
        });
        Reply.sayEmbedWithTitle("Existing commands information",infos);
    }

    static addit(){        
        if(this.getState() > 0 && this.currSong != ''){ // chanson en cours
            let logContent = Library.genre + '/'+this.currSong + '\n'
            Library.writeFileData(logContent, './logs/blindtest-list.txt')  
            Reply.say('Song added for blindtest : ' + this.currSong);
        } else{
            console.log("pas de chanson"+this.currSong)
        }
    }
    static askfor(message){
        let askedSong = message.content.split(' ')[1];
        if(askedSong !== undefined){
            askedSong+= ', '+message.member.user.username
            Library.writeFileData(askedSong,'./logs/ask-song.txt')
            Reply.say("Song asked")
        }
    }

    /////////////////////////////////////////// END OF COMMANDS /////////////////////////////////////////////////////////////////////

    static playNextFile() {
        this.nbVoteskip = 0
        var song = Library.setNextFile();
        console.log(song)
        var songNameArray = song.split('/');
        this.currSong = songNameArray[songNameArray.length-1];
        this.dispatcher = Radio.connection.play(song);
        if(this.blindtest){
            Blindtest.setupBlindtest(this.currSong).then(()=>{
                console.log("finito dans radio")
                if(Blindtest.isBlindtestOn) Radio.playNextFile()
            })
        }
        else {
            Reply.sayEmbedSong(Library.getSongName(Radio.currSong), Library.getSongArtist(Radio.currSong), Library.genre,"./img/dvd.png");
            this.dispatcher.on('finish', function(){
                if(!Radio.blindtest) Radio.playNextFile()
            })
        }
    }

    static isBlindtestOn(){
        return this.blindtest
    }

    static getState() {
        return this.state
    }

    static setState(val) {
        Blindtest.setBlindtestOn(this.blindtest && val === 1)
        this.state = val
    }
    static setCommands(commands){
        this.commands = commands
    }

    static setPlaylistEveryHour(){
        var now = new Date();
        var delay = 60 * 60 * 1000; // 1 hour in msec
        var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + 10000 //+ now.getMilliseconds();
        //this.countChannelPoints()
        setTimeout(function updating() {
            if(Radio.state === 1){
            console.log("every hour passed : "+new Date().getHours())
            Radio.nbVotelist=0
            Library.setPlanningsPlaylist()
            Radio.countChannelPoints()
            }
        setTimeout(updating, delay);
        }, start);

    }
    static countChannelPoints(){
        console.log("points de chaine")
        let nbUserInChannel = 0
        this.voiceChan.members.forEach(user => {
            console.log(user.user.username)
            if(!user.user.bot){
                console.log(user.user.id) //361979066951270400
                BD.getUserById(user.user.id.toString()).then(res =>{
                    if(res){
                        BD.addOneHourToUser(user.user.id.toString(), res.hoursSpent)
                    } else{
                        var newUser = new Object()
                        newUser.name = (user.user.username)
                        newUser.role  = 1
                        newUser.nbCmds = 0
                        newUser.hoursSpent = 1
                        newUser.skips = 0
                        newUser.skiplists = 0
                        newUser._id = user.user.id.toString()
                        newUser.blindtestPoints = 0
                        var jsonUser= JSON.parse(JSON.stringify(newUser))
                        BD.addUser(jsonUser)
                    }
                });
                nbUserInChannel++
            }
        });
        if(nbUserInChannel === 0){
            this.stop()
        }
            
    }

    static checkMessage(message){
        console.log("writer id : " + message.member.user.id)
        const id = message.member.user.id.toString()
        BD.getUserById(id).then(res =>{
            if(res){
                BD.addOneCmdToUser(id, res.nbCmds)
            } else{
                var newUser = new Object()
                newUser.name = (message.member.user.tag)
                newUser.role  = 1
                newUser.nbCmds = 1
                newUser.hoursSpent = 0
                newUser._id = id
                newUser.skips = 0
                newUser.skiplists = 0
                newUser.blindtestPoints = 0
                var jsonUser= JSON.parse(JSON.stringify(newUser))
                BD.addUser(jsonUser)
            }
        });
    }
    static async authorizedUser(message, requiredAuth){
        const id = message.member.user.id.toString()
        let role = 1
        let result = await BD.getUserById(id).then(user =>{
            if(user){
                role = user.role
                //console.log(user)
            } 
        })
        return role <= requiredAuth
    }

}