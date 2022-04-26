
const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Report extends Command{

    static name = this.cmdChar+'report';
    static helpInfo = ' [reason] *Report current song (bug...)*';
    static authorizedLevel = 1;

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.report(message, this.name.length);
    }
}