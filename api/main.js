const express    = require('express');
const app        = express(); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('../app/models/user');
const Note = require('../app/models/note');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'rise and grind',
    resave: true,
    saveUninitialized: false
}));

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

let port = process.env.PORT || 3000;

const router = express.Router();         

app.use('/api', router);

mongoose.connect('mongodb://127.0.0.1:27017').then(function(){
    app.listen(port);
}).catch(console.log);

console.log('Listening on port ' + port);

//Main API endpoint
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the API!' });   
});

//Authenticate login
router.post('/login', function(req, res) {
    User.authenticate(req.body.email, req.body.password, function(err, user) {
        if (err) {
            res.status(400).json({message:err.message});
        }
        req.session.userId = user._id;
        res.json({message:'Logged in'});
    });
});

//Sign up
router.route('/users').post(function(req, res) {
    let user = new User();
    user.email = req.body.email;
    if (req.body.password.length <= 8) {
        res.status(400).json({message:'Password too short'});
    }
    user.password_hash = req.body.password;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_number = req.body.phone_number;
    user.save(function(err) {
        if (err)
            res.status(400).json(err);
        res.status(200).json({message: 'Created new user ' + user.email + '!'});
    });
});

//Create new note
router.route('/notes').post(function(req, res) {
    if (!req.session) {
        res.status(401).json({message:'Not authenticated'});
    }
    let note = new Note();
    note.body = req.body.body;
    note.date = req.body.date;
    note.user_id = req.session.userId

    note.save(function(err) {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({message:'Created new note for ' + note.date + '!'});
    })
});

//Get list of notes for a user
router.route('/notes').get(function(req, res) {
    if (!req.session) {
        res.status(401).json({message:'Not authenticated'});
    }
    notes = Note.getNotes(req.session.userId, function(err, notes){
        if (err) {
            res.status(400).json({message:err.message});
        }
        res.status(200).json({message:notes});
    });
});
 
router.route('/notes/:note_id').get(function(req, res) {
    if (!req.session) {
        res.status(401).json({message:'Not authenticated'});
    }
    Note.getNoteFromID(req.params.note_id, function(err, note) {
        if (err) {
            res.status(400).json({message:err.message});
        }
        res.status(200).json({message:note});
    });
});