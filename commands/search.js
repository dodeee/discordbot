const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Search extends Command{

    static name = this.cmdChar+'search';
    static helpInfo = ' name/artist';
    static authorizedLevel = 1;


    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.searchSong(message, this.name.length)
    }
}