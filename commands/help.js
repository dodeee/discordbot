const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Help extends Command{

    static name = this.cmdChar+'help';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        
    }
}