const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Next extends Command{

    static name = this.cmdChar+'next';
    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.next()
    }
}