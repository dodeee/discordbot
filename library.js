module.exports = class Library{

    static playlist = 0

    static genre = 'rap';
    static songFolder = './son/';

    static createPlaylist(){
        const fs = require('fs');
        //var randNum = Math.floor(Math.random()*this.getSongFolders().length);
        //this.genre = this.getSongFolders()[randNum];
        //console.log("val:"+randNum+" - genre: "+this.genre);
        const arrayShuffle = require('array-shuffle');
        this.playlist = arrayShuffle(fs.readdirSync(this.songFolder +this.genre+'/'))
    }

    static getSongName(){
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

    static getSongFolders(){
        const fs = require('fs');
        const directories = fs.readdirSync(this.songFolder)
        .filter(function (file) {
            return fs.statSync(Library.songFolder+file).isDirectory();
        });
        return directories;
    }

    static setGenre(genre){
        this.genre = genre;
        this.playlist=[];
    }

}