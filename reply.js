const { MessageEmbed } = require('discord.js');

module.exports = class Reply {
    static messager = 0

    static setMessager(chan){
        this.messager = chan
    }
    static say(msg){
        this.messager.send(msg)
    }
    static sayEmbedSong(songName, artist, description, img){
        // var removeExt = song.split('.');
        // var songArray= removeExt[0].split('-');
        // var songName = songArray[0];
        // var artist = songArray[1];
        const songEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(songName)
        .setDescription(artist)
        .setThumbnail('https://ak.picdn.net/shutterstock/videos/1019445205/thumb/1.jpg?ip=x480')
        .addField("Playlist",description.toUpperCase())
        .setTimestamp()
        .setFooter("\u2800".repeat(30/*any big number works too*/)+"|")
        this.messager.send(songEmbed);
        }
    static sayEmbedWithTitle(title, content){
        const searchEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription(content)
        this.messager.send(searchEmbed)
    }
}