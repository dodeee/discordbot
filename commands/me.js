const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Me extends Command{

    static name = this.cmdChar+'me';
    static authorizedLevel = 1;
    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.me(message)
    }
}