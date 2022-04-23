const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class RadioMode extends Command{

    static name = this.cmdChar+'radio';
    static authorizedLevel = 1;

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.setBlindtest(false);
    }
}