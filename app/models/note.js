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

NoteSchema.statics.getNotes = function(user_id, callback) {
    Note.find({user_id:user_id})
    .exec(function(err, notes) {
        if (err) {
            return callback(err);
        }
        return callback(null, notes);
    });
}

NoteSchema.statics.getNoteFromID = function(note_id, callback) {
    Note.findOne({_id:note_id})
    .exec(function(err, notes) {
        if (err) {
            return callback(err);
        }
        return callback(null, note)
    });
}

Note = mongoose.model('Note', NoteSchema)

module.exports = Note