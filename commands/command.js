const Radio = require("../Radio")

module.exports = class Command{

    static cmdChar = "!";
    static helpInfo = '';

    static parse(message){
        //let reg = /^[a-zA-Z]+$/
        //if(message.content.startsWith(this.cmdChar) && reg.test(message.content.substr(1))){
            if(this.match(message)){
                this.action(message)
                Radio.checkMessage(message);
                return true
            }
        // } else {
        //     console.log("bad command")
        // }
        
        return false
    }

    static name = 'undefined';

    static getName(){
        return this.name;
    }

    static getHelpInfo(){
        return this.helpInfo
    }
}