const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required : true},
    role: {type: String, required : true}, // role 0: admin ; role 1 : usernormal ; role 2 ; banned user
    nbCmds: {type: Number, required : true},
    _id: {type: Number, required : true},
});

module.exports = mongoose.model('UserSchema', userSchema);