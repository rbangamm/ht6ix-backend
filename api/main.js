const express    = require('express');
const app        = express(); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const session = require('express-session')

const User = require('../app/models/user');
const Note = require('../app/models/note');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'rise and grind',
    resave: true,
    saveUninitialized: false
}));

let port = process.env.PORT || 8080;

const router = express.Router();         

app.use('/api', router);

mongoose.connect('mongodb://127.0.0.1:27017')/*.then(function(){
    app.listen(port);
}).catch(console.log);*/

app.listen(port)

console.log('Listening on port ' + port);

//Main API endpoint
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the API!' });   
});

//Authenticate login
router.post('/login', function(req, res) {
    User.authenticate(req.body.username, req.body.password, function(err, user) {
        if (err) {
            res.status(401).json({message : 'Login failed'})
        }
        if (user) {
            req.session.userId = user._id;
            res.json({message:'Logged in'});
        }
    });
});

//Sign up
router.route('/users').post(function(req, res) {
    let user = new User();
    user.username = req.body.username;
    user.password_hash = req.body.password;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_number = req.body.phone_number;
    user.email = req.body.email;
    user.save(function(err) {
        if (err)
            res.send(err);
        res.json({message: 'Created new user ' + user.username + '!'});
    });
});