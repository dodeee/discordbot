const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Setlist extends Command{

    static name = this.cmdChar+'setlist';
    static authorizedLevel = 0;
    static helpInfo = ' 1/2/3...'

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.setlist(message);
    }
}