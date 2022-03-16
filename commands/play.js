const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Play extends Command{

    static name = this.cmdChar+'play';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.play()
    }
}