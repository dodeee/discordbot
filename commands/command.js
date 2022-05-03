const Radio = require("../Radio")

module.exports = class Command{

    static cmdChar = "!";
    static helpInfo = '';
    static authorizedLevel = 1;

    static parse(message){
        //let reg = /^[a-zA-Z]+$/
        //if(message.content.startsWith(this.cmdChar) && reg.test(message.content.substr(1))){
        let reg = /^[!a-zA-Z0-9\sàâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ&']+$/

        if(message.content.startsWith(this.cmdChar) && reg.test(message.content)){ 
            if(this.match(message)){
                Radio.authorizedUser(message, this.authorizedLevel).then(authorized =>{
                
                    if(authorized){
                        this.action(message)
                        Radio.checkMessage(message);
                        return true
                    }
                })
            // } else {
            //     console.log("bad command")
            // }
            }
        } else {
           // console.log("Bad format")
        }
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