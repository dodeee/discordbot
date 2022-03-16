const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Genre extends Command{

    static name = this.cmdChar+'genre';

    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.switchGenre(message);
    }
}