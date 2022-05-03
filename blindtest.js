const Library = require('./library')
const Reply = require('./reply')
const BD = require('./model/BD')
const levenshtein = require('js-levenshtein');
const CONSTS = require('./data/consts')


module.exports = class Blindtest{

    static isBlindtestAnswer = false
    static isBlindtestSongFound = false
    static isBlindtestArtistFound = false
    static isBlindtestOn = false
    static stateChanged = false
    static song = ''
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
            if(Blindtest.isBlindtestOn && !Blindtest.stateChanged) Reply.say(Math.trunc(CONSTS.blindtestDelay/2) + " sec . . .")
         }, (CONSTS.blindtestDelay/2)* 1000);
         setTimeout(function(){
            if(Blindtest.isBlindtestOn && !Blindtest.stateChanged) Reply.say(Math.trunc(CONSTS.blindtestDelay/4) + " sec . . .")
         }, (CONSTS.blindtestDelay*0.75)* 1000);
        setTimeout(function(){
            if(Blindtest.isBlindtestOn && !Blindtest.stateChanged) Reply.sayEmbedSong(Library.getSongName(song), Library.getSongArtist(song),Library.genre,"./img/dvd.png");
            Blindtest.isBlindtestAnswer = false
        }, CONSTS.blindtestDelay* 1000 );
        
        return new Promise(resolve => setTimeout(resolve,CONSTS.blindtestDelay* 1000+10000))
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
            Reply.say(message.member.user.username+" found song for "+CONSTS.pointsPerFound+" points !")
            this.isBlindtestSongFound = true
            BD.getUserById(id).then(user =>{
                if(user){
                        BD.addBlindtestPoints(id, CONSTS.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
            this.giveBonusPoints(message.member.user.username)

        }
        if(!this.isBlindtestArtistFound && (answer.includes(currArtist) || leveshteinArtist < currArtist.length/4)){
            this.artistFounder = id
            Reply.say(message.member.user.username+" found artist for "+CONSTS.pointsPerFound+" points !")
            this.isBlindtestArtistFound = true
            BD.getUserById(id).then(user =>{
                if(user){
                        BD.addBlindtestPoints(id, CONSTS.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
            this.giveBonusPoints(message.member.user.username)
        }
        
    }

    static giveBonusPoints(username){
        if(this.songFounder !== "" && this.songFounder === this.artistFounder){
            Reply.say(username+" found artist AND song for "+CONSTS.pointsPerFound+" bonus point!")
            BD.getUserById(this.artistFounder).then(user =>{
                if(user){
                        BD.addBlindtestPoints(this.artistFounder, CONSTS.pointsPerFound)
                } else{
                    console.log("UnknownUser");
                }
            })
        }
    }

    static setBlindtestOn(val){
        
        this.isBlindtestOn = val
    }
    static hasStateChanged(val){
        this.stateChanged = val
    }
}