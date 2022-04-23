const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Voteskip extends Command{

    static name = this.cmdChar+'votelist';
    static authorizedLevel = 1;

    static helpInfo = '  *Skips the playlist if enough people voted*'

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.votelist(message)
    }
}