const Library = require('./library')
const Reply = require('./reply')
const BD = require('./model/BD')
const levenshtein = require('js-levenshtein');


module.exports = class Blindtest{

    static isBlindtestAnswer = false
    static isBlindtestSongFound = false
    static isBlindtestArtistFound = false
    static blindtestDelay=15;
    static isBlindtestOn = false
    static song = ''
    static pointsPerFound = 50
    static songFounder = ""
    static artistFounder= ""

    static setupBlindtest(song){
        this.song = song
        Reply.say("Go !")
        this.songFounder=""
        this.artistFounder=""
        this.isBlindtestArtistFound = false
        this.isBlindtestSongFound = false
        this.isBlindtestAnswer=true
        setTimeout(function(){
            // console.log("valblindtest= "+Radio.blindtest);
            if(Blindtest.isBlindtestOn) Reply.say(Math.trunc(Blindtest.blindtestDelay/2) + " sec . . .")
         }, (this.blindtestDelay/2)* 1000);
         setTimeout(function(){
            // console.log("valblindtest= "+Radio.blindtest);
            if(Blindtest.isBlindtestOn) Reply.say(Math.trunc(Blindtest.blindtestDelay/4) + " sec . . .")
         }, (this.blindtestDelay*0.75)* 1000);
        setTimeout(function(){
            if(Blindtest.isBlindtestOn) Reply.sayEmbedSong(Library.getSongName(song), Library.getSongArtist(song),Library.genre,"./img/dvd.png");
            Blindtest.isBlindtestAnswer = false
        }, this.blindtestDelay* 1000 );
        
        return new Promise(resolve => setTimeout(resolve,this.blindtestDelay* 1000+10000))
    }

    static readBlindtestAnswer(message){
        const id = message.member.user.id.toString()
        const answer = message.content.toLowerCase()
        const currSong = Library.getSongName(this.song).toLowerCase()
        const currArtist = Library.getSongArtist(this.song).toLowerCase()
        const leveshteinSong = levenshtein(answer, currSong)
        const leveshteinArtist = levenshtein(answer, currArtist)


        if(!this.isBlindtestSongFound && (answer.includes(currSong) || leveshteinSong < currSong.length/4)){
            this.songFounder = id
            
            Reply.say(message.member.user.username+" found song for "+this.pointsPerFound+" points !")
            this.isBlindtestSongFound = true
            BD.getUserById(id).then(user =>{
                if(user){
                        BD.addBlindtestPoints(id, Blindtest.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
            this.giveBonusPoints(message.member.user.username)

        }
        if(!this.isBlindtestArtistFound && (answer.includes(currArtist) || leveshteinArtist < currArtist.length/4)){
            this.artistFounder = id
            Reply.say(message.member.user.username+" found artist for "+this.pointsPerFound+" points !")
            this.isBlindtestArtistFound = true
            BD.getUserById(id).then(user =>{
                if(user){
                        BD.addBlindtestPoints(id, Blindtest.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
            this.giveBonusPoints(message.member.user.username)
        }
        
    }

    static giveBonusPoints(username){
        if(this.songFounder !== "" && this.songFounder === this.artistFounder){
            Reply.say(username+" found artist AND song for "+this.pointsPerFound+" bonus point!")
            BD.getUserById(this.artistFounder).then(user =>{
                if(user){
                        BD.addBlindtestPoints(this.artistFounder, Blindtest.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
        }
    }

    static setBlindtestOn(val){
        this.isBlindtestOn = val
    }
}