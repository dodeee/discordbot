
const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Report extends Command{

    static name = this.cmdChar+'report';
    static helpInfo = ' [reason]';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.reportSong(message, this.name.length);
    }
}