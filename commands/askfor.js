const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Askfor extends Command{

    static name = this.cmdChar+'askfor';
    static authorizedLevel = 1;
    static helpInfo = '  *Add to ask list*'
    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.askfor(message)
    }
}