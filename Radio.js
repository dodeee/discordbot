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

    static start(message) {
        if (this.getState() === 0) {
            Reply.say("Welcome to RadioBot (type !help for command info)")
            if(this.blindtest) Reply.say("**Blindtest mode**")
            else Reply.say("**Radio mode**")
            this.setState(1)
            Library.createPlaylist()
            this.voiceChan = message.guild.channels.cache
                .filter(function (channel) { return channel.type === 'voice' })
                .first()
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

    static playNextFile() {
        this.nbVoteskip = 0
        var song = Library.getSongName();
        var songNameArray = song.split('/');
        var songName = songNameArray[songNameArray.length-1];
        if(this.blindtest){
                this.dispatcher = Radio.connection.play(song);
                setTimeout(function(){
                    Reply.sayEmbed(songName, Library.genre,"./img/dvd.png");
                }, this.blindtestDelay* 1000 );
                setTimeout(function(){
                    console.log("valblindtest= "+Radio.blindtest);
                   if(Radio.blindtest) Radio.playNextFile()
                }, this.blindtestDelay* 1000+10000);
                
        }
        else {
            this.dispatcher = Radio.connection.play(song);
            Reply.sayEmbed(songName, Library.genre,"./img/dvd.png");
            this.dispatcher.on('finish', function(){
                if(!Radio.blindtest) Radio.playNextFile()
            })
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
    
    static playlists(){
        if(this.getState!=0){
            var lists= '';
            Library.getSongFolders().forEach(element => {
                lists+= ' ' + element;
            });
            Reply.say("Available playlists : "+ lists);
        }
    }
    
    static me(message){
        BD.getUserById(message.member.user.id)
        .then(res =>{
            if(res){
                var roleName = "unknown";
                if(res.role==0) roleName = "Admin";
                else if(role==1) roleName = "User";
                Reply.say("User: "+res.name+"\nNbCmd: "+res.nbCmds+"\nRole: "+roleName);
            } else{
                console.log("UnknownUser");
            }
            
        })
        .catch((error) => console.log("Promise error"));
        console.log(message.member.user.tag);
        console.log(message.member.user.id);
    }
    
    static checkMessage(message){
        BD.getUserById(message.member.user.id).then(res =>{
            if(res){
                BD.addOneCmdToUser(message.member.user.id, res.nbCmds);
            } else{
                var obj = new Object();
                obj.name = (message.member.user.tag);
                obj.role  = 1;
                obj.nbCmds = 0;
                obj._id = message.member.user.id;
                var jsonUser= JSON.parse(JSON.stringify(obj));
                BD.addUser(jsonUser);
            }
        });
    }
    
    static switchGenre(message){
        if(this.getState!=0){
            var genre = message.content.split(' ')[1];
            if(genre !== undefined){
                const includesValue = Library.getSongFolders().some(element => {
                    return element.toLowerCase() === genre.toLowerCase();
                });
                if(includesValue){
                    Library.setGenre(genre);
                } else{
                    console.log("Genre doesnt exist");
                }
            } else {
                Reply.say("Genre : "+Library.genre);
            }
            console.log(genre);
        }
    }

    static getState() {
        return this.state
    }

    static setState(val) {
        this.state = val
    }

    static setBlindtest(val){
        this.blindtest=val;
        if(this.blindtest) Reply.say("**Blindtest mode**")
        else Reply.say("**Radio mode**")
    }
}