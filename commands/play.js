const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Play extends Command{

    static name = this.cmdChar+'play';
    static authorizedLevel = 0;

    static match(message){
        return message.content === this.name
    }

    static action(message){
        Radio.play()
    }
}