const planning = require('./data/planning')
const arrayShuffle = require('array-shuffle');

module.exports = class Library{

    static playlist = []
    static forcedList = false
    static genre = 'ROCK';
    static songFolder = './son/';

    static createPlaylist(){
        const fs = require('fs');
        if(!this.forcedList) this.setPlanningsPlaylist()
        this.playlist = arrayShuffle(fs.readdirSync(this.songFolder +this.genre+'/'))
    }

    static createBlindtestPlaylist(){
        const fs = require('fs');
        let data = fs.readFileSync('./logs/blindtest-list.txt',{encoding:'utf8', flag:'r'});
        data = data.split('\n')
        this.playlist = arrayShuffle(data)
    }

    static setNextFile(isBlindtest){
        if(this.playlist.length === 0){
            if(isBlindtest) {this.createBlindtestPlaylist()}
            else {this.createPlaylist()}
        }
        let song = this.playlist[0]
        this.playlist.shift()
        if(isBlindtest) {return this.songFolder+song}
        else {return this.songFolder+ this.genre+'/'+song}
                 
    }

    static getSongName(){
        return this.playlist[0]
    }

    static getSongFolders(){
        const fs = require('fs');
        const directories = fs.readdirSync(this.songFolder)
        .filter(function (file) {
            return fs.statSync(Library.songFolder+file).isDirectory();
        });
        return directories;
    }

    static setSongFolder(genre){
        const includesList = this.getSongFolders().some(e=> {
            return e.toLowerCase() === genre.toLowerCase();
        });
        if(includesList){
            this.forcedList=true
            this.genre = genre;
            this.playlist=[];
        } else{
            console.log("Genre doesnt exist");
        }   
    }


    static searchSong(input){
        const fs = require('fs');
        let songs, matches = []
        let searchResult = []
        //chercher a travers tous les folders de songs
        this.getSongFolders().forEach(dir => {
            songs = fs.readdirSync(this.songFolder +dir+'/')
            matches = songs.filter(song =>{
                if(song.toLowerCase().includes(input.toLowerCase())) return true
            })
            if(matches.length>0){
                matches.forEach((match,index, arr) => {
                    match = Library.getSongArtist(match) + ' - '+ Library.getSongName(match)
                    arr[index] = match + " ("+dir+")"
                })
                Array.prototype.push.apply(searchResult, matches);
            }   
        });
        let remaingResults
        if(searchResult.length > 15){
            remaingResults = searchResult.length - 15
            searchResult.length=15
            searchResult.push("-- And "+ remaingResults +" more results")
        }
            
        return searchResult
    }

    static setPlanningsPlaylist(){
        console.log("verifplaylist")
        this.forcedList = false
        const plan = JSON.parse(planning)
        let today = new Date()
        let currDay = today.getDay()
        const dayConversion= ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        currDay = dayConversion[currDay]

        let hour = today.getHours()
        let currSlot = plan.find(timeSlot =>
            timeSlot.day===currDay &&  hour >= timeSlot.begin && hour < timeSlot.end 
        )
        if(currSlot !== undefined){
            if(currSlot.list === "videogames-ost-movie-opening"){
                console.log("viedogameslist\n")
                this.setSongFolder("hiphop-rap-trap-phonk-instrumental")
            } else {
                this.setSongFolder(currSlot.list)
            }
        } else {
            this.setSongFolder("pop-rock-alternative-folk-funk")
        }
        console.log("slot : "+currSlot.day+currSlot.list)
    }

    static getSongArtist(song){
        
        return song.split('-')[0].trim()
    }
    static getSongName(song){
        let fileExtPos = song.lastIndexOf(".");
        if(song.substring(0, fileExtPos).split('-')[1]){
            return song.substring(0, fileExtPos).split('-')[1].trim()
        } else{
            return song.substring(0, fileExtPos)
        }
    }
    static writeFileData(content, filename){
        const fs = require('fs')
        fs.writeFile(filename, content,{flag: 'a+'}, err => {
            if (err) {
            console.error(err)
            return
            }
        })
    }
}