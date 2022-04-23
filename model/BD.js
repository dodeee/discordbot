const User = require('./Scheme');
const mongoose = require('mongoose');


module.exports = class BD{

    static async BDConnect(){
        mongoose.connect('mongodb+srv://dodee:Etienne38@cluster0.0p8d5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        { useNewUrlParser: true,
            useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'));
    }

    static getAllUsers(){
       return User.find()
        .then(items => {
            console.log('Successfully found ');
            return items;
          })
        .catch((error) => console.log(error));
    }

    static getUserById(id){
        return User.findOne({_id: id})
        .then((user) => {console.log("" ); return user;})
        .catch((error) => console.log(error));
    }

    static addUser(userInfo){
        console.log(userInfo);
        const user = new User({
            ...userInfo
          });
        console.log("nouvel item bd");
        user.save()
        .then(() => console.log("saved object"))
        .catch((error) => {console.log(error);});
    }
    static addOneCmdToUser(id, nbC){
        User.updateOne({_id: id}, {nbCmds: nbC+1})
        .then(() => console.log(""))
        .catch((error) => console.log(error));
    }
    static addOneHourToUser(id, nbH){
        User.updateOne({_id: id}, {hoursSpent: nbH+1})
        .then(() => console.log(""))
        .catch((error) => console.log(error));
    }
    static setRole(id, newRole){
        User.updateOne({_id: id}, {role: newRole})
        .then(() => console.log("set role"))
        .catch((error) => console.log(error));
    }


    static updateUser(){

    }
    static deleteUserById(id){
        User.deleteOne({_id: id})
        .then(() => console.log("deleted object"))
        .catch((error) => console.log(error));
    }

    static deleteAllUsers(){
        User.deleteMany()
        .then((user) => console.log("deleted object" + user))
        .catch((error) => console.log(error));
    }

    static addSkips(id, skipsUsed, skipListsUsed){
        User.updateOne(
            {_id: id}, 
            {$inc:{'skips': skipsUsed, 'skiplists': skipListsUsed}}
            )
        .then(() => console.log(""))
        .catch((error) => console.log(error));
    }
    static addBlindtestPoints(id, nb){
        User.updateOne(
            {_id: id}, 
            {$inc:{'blindtestPoints':nb}}
            )
        .then(() => console.log(""))
        .catch((error) => console.log(error));

    }   
}