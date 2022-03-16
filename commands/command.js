const Radio = require("../Radio")

module.exports = class Command{

    static cmdChar = "!";

    static parse(message){
        if(this.match(message)){
            this.action(message)
            Radio.checkMessage(message);
            return true
        }
        return false
    }

    static name = 'undefined';

    static getName(){
        return this.name;
    }
}