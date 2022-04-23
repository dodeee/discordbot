const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class BlindtestMode extends Command{

    static name = this.cmdChar+'blindtest';
    static authorizedLevel = 1;


    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.setBlindtest(true);
    }
}