const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Pause extends Command{
    
    static name = this.cmdChar+'pause';

    static match(message){
        return message.content === this.name
    }

    static action(message){
        Radio.pause()
    }
}