const express    = require('express');
const app        = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../api/config')


const User = require('../app/models/user');
const Note = require('../app/models/note');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'rise and grind',
    resave: true,
    saveUninitialized: false
}));

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
    console.log('Authenticating...');
    User.authenticate(req.body.email, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.status(400).json({message:err.message});
        }
        let token = jwt.sign({id:user._id}, config.secret, {
            expiresIn: 86400
        });
        res.json({message:'Logged in', token: token, auth: true});
    });
});

//Sign up
router.route('/users').post(function(req, res) {
    let user = new User();
    user.email = req.body.email;
    if (req.body.password.length < 8) {
        res.status(400).json({message:'Password too short'});
    }
    user.password_hash = req.body.password;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_number = req.body.phone_number;
    user.save(function(err) {
        if (err)
            res.status(400).json(err);
        let token = jwt.sign({id:user._id}, config.secret, {
            expiresIn: 86400
        });
        res.status(200).json({message: 'Created new user ' + user.email + '!', token: token, auth: true});
    });
});

//Create new note
router.route('/notes').post(function(req, res) {

    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth:false, message:'No token'});
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({auth: false, message:'Failed to authenticate'});
    });
    let note = new Note();
    note.body = req.body.body;
    note.date = req.body.date;
    note.user_id = token.id;

    note.save(function(err) {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({message:'Created new note for ' + note.date + '!'});
    })
});

//Get list of notes for a user
router.route('/notes').get(function(req, res) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth:false, message:'No token'});
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({auth: false, message:'Failed to authenticate'});
    });
    notes = Note.getNotes(req.session.userId, function(err, notes){
        if (err) {
            res.status(400).json({message:err.message});
        }
        res.status(200).json({message:notes});
    });
});
 
router.route('/notes/:note_id').get(function(req, res) {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth:false, message:'No token'});
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({auth: false, message:'Failed to authenticate'});
    });
    Note.getNoteFromID(req.params.note_id, function(err, note) {
        if (err) {
            res.status(400).json({message:err.message});
        }
        res.status(200).json({message:note});
    });
});