const Library = require('./library')
const Reply = require('./reply')
const BD = require('./model/BD')

module.exports = class Radio {
    static state = 0
    static connection = 0
    static dispatcher = 0
    static voiceChan = 0
    static nbVoteskip = 0
    static blindtest = false;
    static blindtestDelay=10;
    static currSong='';

    //// RADIO COMMANDS ///////////////////////////////////////////////////////////////////////////

    static start(message) {
        if (this.getState() === 0) {
            this.voiceChan = message.guild.channels.cache
            .filter(function (channel) { return channel.type == 'voice' && channel.id == 639485992952397829 }) // 639485992952397829
            .first()
            this.setPlaylistEveryHour()
            Reply.sayEmbedWithTitle("Welcome to RadioBot (type !help for command info)", '')
            if(this.blindtest) Reply.say("**Blindtest mode**")
            else Reply.say("**Radio mode**")
            this.setState(1)
            Library.createPlaylist()
           
            //console.log(this.voiceChan)
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
        if (this.getState != 0) {
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
        this.nbVoteskip+=1
        let mandatoryVoteskipNb = Math.ceil((this.voiceChan.members.size - 1)/2);
        Reply.say("Voteskip : "+ this.nbVoteskip+" / Necessary : "+ mandatoryVoteskipNb);
        if(this.nbVoteskip >= mandatoryVoteskipNb){
            Reply.say("Song skipped")
            this.playNextFile();
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
                let channelPoints = res.nbCmds*10 + res.hoursSpent*100
                var roleName = "unknown";
                if(res.role==0) roleName = "Admin";
                else if(res.role==1) roleName = "User";
                Reply.sayEmbedWithTitle("User: "+res.name+"\n","Chan Points: "+channelPoints+"\nRole: "+roleName);
            } else{
                console.log("UnknownUser");
            }
            
        })
        //.catch((error) => console.log("Promise error"));
        console.log(message.member.user.tag);
        console.log(message.member.user.id);
    }

    static setBlindtest(val){
        this.blindtest=val;
        if(this.blindtest) Reply.say("**Blindtest mode**")
        else Reply.say("**Radio mode**")
    }
    
   
    
    static setlist(message){
        console.log(message.content)
        if(this.getState!=0){
            let chosenListNum = message.content.split(' ')[1];
            if(chosenListNum !== undefined && (chosenListNum-1) >= 0 && (chosenListNum-1) < Library.getSongFolders().length){
                console.log(Library.getSongFolders()[chosenListNum-1])
                Library.setGenre(Library.getSongFolders()[chosenListNum-1]); 
            } else {
                console.log("bad list choice")
            }
        }
    }


    static reportSong(message, commandLength){
        const fs = require('fs')
        
        if(this.getState() > 0 && this.currSong != ''){ // chanson en cours
            let logContent = this.currSong
            let reason = message.content.substr(commandLength)
            if(reason){
                logContent+=', '+reason
            }
            logContent+=', ' +new Date()+'\n'
            fs.writeFile('./logs/report-logs.txt', logContent,{flag: 'a+'}, err => {
                if (err) {
                console.error(err)
                return
                }
                Reply.say('Reported song : ' + this.currSong);
            })
        } else{
            console.log("pas de chanson"+this.currSong)
        }

    }

    static searchSong(message, commandLength){
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

    /// END OF COMMANDS /////////////////////////////////////////////////////////////////////

    static playNextFile() {
        this.nbVoteskip = 0
        var song = Library.setNextFile();
        console.log(song)
        var songNameArray = song.split('/');
        this.currSong = songNameArray[songNameArray.length-1];
        if(this.blindtest){
                this.dispatcher = Radio.connection.play(song);
                setTimeout(function(){
                    Reply.sayEmbedSong(currSong, Library.genre,"./img/dvd.png");
                }, this.blindtestDelay* 1000 );
                setTimeout(function(){
                    console.log("valblindtest= "+Radio.blindtest);
                   if(Radio.blindtest) Radio.playNextFile()
                }, this.blindtestDelay* 1000+10000);
                
        }
        else {
            this.dispatcher = Radio.connection.play(song);
            Reply.sayEmbedSong(this.currSong, Library.genre,"./img/dvd.png");
            this.dispatcher.on('finish', function(){
                if(!Radio.blindtest) Radio.playNextFile()
            })
        }
    }

    static getState() {
        return this.state
    }

    static setState(val) {
        this.state = val
    }

    static setPlaylistEveryHour(){
        var now = new Date();
        var delay = 60 * 60 * 1000; // 1 hour in msec
        var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + 10000 //+ now.getMilliseconds();
        console.log("members : "+ JSON.stringify(this.voiceChan.members[0]))
        //this.countChannelPoints()
        setTimeout(function updating() {
            if(Radio.state === 1){
            console.log("every hour passed : "+new Date().getHours())
            Library.setPlanningsPlaylist()
            Radio.countChannelPoints()
            }
        setTimeout(updating, delay);
        }, start);

    }
    static countChannelPoints(){
        console.log("points de chaine")
        this.voiceChan.members.forEach(user => {
            console.log(user.user.username)
            if(user.user.username !== "RadioBot"){
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
                        newUser._id = user.user.id.toString()
                        var jsonUser= JSON.parse(JSON.stringify(newUser))
                        BD.addUser(jsonUser)
                    }
                });
            }
        });
        
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
                var jsonUser= JSON.parse(JSON.stringify(newUser))
                BD.addUser(jsonUser)
            }
        });
    }
}