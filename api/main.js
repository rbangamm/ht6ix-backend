const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;        // set our port

const router = express.Router();              // get an instance of the express Router


router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the API!' });   
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);