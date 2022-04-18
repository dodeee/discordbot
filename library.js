//import {planning} from './data/planning'
const planning = require('./data/planning')


module.exports = class Library{

    static playlist = 0
    static forcedList = false
    static genre = 'ROCK';
    static songFolder = './son/';

    static createPlaylist(){
        const fs = require('fs');
        // var randNum = Math.floor(Math.random()*this.getSongFolders().length);
        // this.genre = this.getSongFolders()[randNum];
        // console.log("val:"+randNum+" - genre: "+this.genre);
        if(!this.forcedList) this.setPlanningsPlaylist()
        const arrayShuffle = require('array-shuffle');
        this.playlist = arrayShuffle(fs.readdirSync(this.songFolder +this.genre+'/'))
    }

    static setNextFile(){
        if(this.playlist !== 0){
            if(this.playlist.length == 0){
                this.createPlaylist()
            }
                let song = this.playlist[0]
                this.playlist.shift()
                return this.songFolder+ this.genre+'/'+song;            
        } else{
            console.log("No playlist")
            return 0
        }
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

    static setGenre(genre){
        const includesGenre = this.getSongFolders().some(e=> {
            return e.toLowerCase() === genre.toLowerCase();
        });
        if(includesGenre){
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
                    match = match.split('.')[0]
                    arr[index] = match + " ("+dir+")"
                })
                //if(matches.length > 15) matches.length = 15
                //searchResult.push(matches)
                
                Array.prototype.push.apply(searchResult, matches);
            }
            // if(searchResult.length>=15) return false // arreter après 15 résultats
            // return true       
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
                this.setGenre("pop-rock-alternative-folk-funk")
            } else {
                this.setGenre(currSlot.list)
            }
        } else {
            this.setGenre("pop-rock-alternative-folk-funk")
        }
        console.log("slot : "+currSlot.day+currSlot.list)
    }
}