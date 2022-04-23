const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Skip extends Command{
    
    static name = this.cmdChar+'skip';
    static authorizedLevel = 1;
    static helpInfo = '  *Use 500 points to skip the song*'

    static match(message){
        return message.content === this.name
    }

    static action(message){
        Radio.skip(message)
    }
}