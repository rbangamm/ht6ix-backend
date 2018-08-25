const express    = require('express');
const app        = express(); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://74.216.233.86:27017');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;

const router = express.Router();         

app.use('/api', router);

app.listen(port);
console.log('Listening on port ' + port);

//Main API endpoint
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the API!' });   
});

//Authenticate login
router.post('/login', function(req, res) {
    
});

//Sign up
router.post('/users', function(req, res) {
    
});