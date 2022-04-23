const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Addit extends Command{

    static name = this.cmdChar+'addit';
    static authorizedLevel = 1;
    static helpInfo = '  *Add song to blindtest playlist*'
    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.addit(message)
    }
}