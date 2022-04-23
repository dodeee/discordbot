const Command =  require('./command')
const Radio =  require('../Radio')
module.exports = class Start extends Command{

    static name = this.cmdChar+'start';
    static authorizedLevel = 1;

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.start(message)
    }
}