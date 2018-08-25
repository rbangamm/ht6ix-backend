const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    body: String,
    date: { type: Date, unique: true},
    user_id: String
})

NoteSchema.pre('save', function(next) {
    let note = this;
    let timediff = new Date().getTimezoneOffset();
    date = moment(note.date).format("DD//MM//YYYY");
    note.date = date;
    next();
});

NoteSchema.statics.get_notes = function(user_id, callback) {
    Note.findSome({}, {user_id:user_id})
    .exec(function(err, notes) {
        if (err) {
            return callback(err);
        }
        return callback(err, notes);
    });
}

Note = mongoose.model('Note', NoteSchema)

module.exports = Note