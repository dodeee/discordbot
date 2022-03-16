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
        .then((user) => {console.log("found object" ); return user;})
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
        .then(() => console.log("AddedCmd"))
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
}