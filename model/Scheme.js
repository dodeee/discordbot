const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required : true},
    role: {type: Number, required : true}, // role 0: admin ; role 1 : usernormal ; role 2 ; banned user
    nbCmds: {type: Number, required : true},
    hoursSpent: {type: Number, required : true},
    _id: {type: String, required : true},
    skips:{type: Number, required : true},
    skiplists: {type: Number, required : true},
    blindtestPoints:{type:Number, required:true}
});

module.exports = mongoose.model('UserSchema', userSchema);
