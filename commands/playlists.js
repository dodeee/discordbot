const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Playlists extends Command{

    static name = this.cmdChar+'playlist';

    static match(message){
        return message.content.startsWith(this.name);
    }

    static action(message){
        console.log("cmd list action");
        Radio.playlist();
    }
}