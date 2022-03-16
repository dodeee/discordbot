const { MessageEmbed } = require('discord.js');

module.exports = class Reply {
    static messager = 0

    static setMessager(chan){
        this.messager = chan
    }
    static say(msg){
        this.messager.send(msg)
    }
    static sayEmbed(song, description, img){
        var removeExt = song.split('.');
        var songArray= removeExt[0].split('-');
        var songName = songArray[0];
        var artist = songArray[1];
        const songEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(songName)
        .setDescription(artist)
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addField("Genre",description.toUpperCase())
        .setTimestamp()
        this.messager.send(songEmbed);
        }
    
}