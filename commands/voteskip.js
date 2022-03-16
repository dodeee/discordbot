const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Voteskip extends Command{

    static name = this.cmdChar+'voteskip';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.voteskip()
    }
}