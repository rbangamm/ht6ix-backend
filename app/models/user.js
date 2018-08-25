const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password_hash: String,
    first_name: String,
    last_name: String,
    phone_number: String
});

module.exports = mongoose.model('User', UserSchema);