const { expressjwt } = require("express-jwt");

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');


var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())

app.use(fileUpload({ debug : true, limits: { fileSize: 50 * 1920 * 1080 } }));

app.use(express.static(__dirname + '/public/'));

const port = 3000

var { expressjwt: jwt } = require("express-jwt");

app.use(
    jwt({
        secret: process.env.SECRET,
        algorithms: ["HS256"],
        getToken: function fromCookie(req) {
            return req.cookies.token;
        },
    }).unless({ path: ["/", "/sign_up", "/sign_in", { url: "/player", methods: ["GET", "POST"] }, "/player/signin"] })
);
const mysql      = require('mysql2');
const connection = mysql.createConnection({
  host     : '54.37.9.160',
  user     : 'ghr00',
  password : 'WQe[]M{D%(q2A3z$',
  database : 'GHDawri'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

const playerController = require('./controllers/player')(connection);
const matchController = require('./controllers/match')(connection);
const championController = require('./controllers/champions')(connection);

const { create } =  require('express-handlebars');

const hbs = create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    },
    partialsDir: __dirname + '/views/partials/'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    playerController.getAllPlayers( (players) => {
        res.render('index', { connected : req.cookies.token ? true : false, players })
    })
  
})

app.get('/sign_up', (req, res) => {
    res.render('sign_up');
})

app.get('/sign_in', (req, res) => {
    res.render('sign_in');

    
})

const playerRoute = require('./routes/player')(playerController);
const matchRoute = require('./routes/match')(matchController, playerController, championController);

app.use('/player', playerRoute);
app.use('/match', matchRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})