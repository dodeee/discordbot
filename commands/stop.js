const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Stop extends Command{

    static name = this.cmdChar+'stop';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.stop()
    }
}