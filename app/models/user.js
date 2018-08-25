const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    password_hash: String,
    first_name: String,
    last_name: String,
    phone_number: String,
    email: {type: String, unique: true}
});

UserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.hash(user.password_hash, 10, function(err, hash) {
        if (err) {
            return next(err)
        }
        user.password_hash = hash
        next();
    });
});

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email:email})
    .exec(function(err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            let err = new Error('User not found');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password_hash, function(err, result) {
            if (result == true) {
                return callback(null, user);
            } else {
                err = new Error('Invalid credentials');
                err.status = 400;
                return callback(err)
            }
        });
    });
}

User = mongoose.model('User', UserSchema);

module.exports = User