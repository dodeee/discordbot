const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Skiplist extends Command{
    
    static name = this.cmdChar+'skiplist';
    static authorizedLevel = 1;
    static helpInfo = ' 1/2/3... *Use 2500 points to skip the playlist to another one*'

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.skiplist(message)
    }
}