const Command =  require('./command')
const Radio =  require('../Radio')

module.exports = class Leaderboard extends Command{

    static name = this.cmdChar+'leaderboard';
    static authorizedLevel = 1;
    static helpInfo = '  *Show users with most points*'
    static match(message){
        return message.content.startsWith(this.name)
    }

    static action(message){
        Radio.leaderboard()
    }
}