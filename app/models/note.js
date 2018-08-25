const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    body: String,
    date: { type: Date, unique: true},
    user_id = String
})

NoteSchema.pre('save', function(next) {
    let note = this;
    let timediff = new Date().getTimezoneOffset();
    date = moment(note.date).format("DD//MM//YYYY");
    note.date = date;
    next();
});

module.exports = mongoose.model('Note', NoteSchema)