const express = require('express')
<<<<<<< HEAD
const env = require('dotenv').config()
const firebase = require('firebase')

const firebaseConfig = require('./firebaseConfig')
const routes = require('./routes/routes')

const firebaseApp = firebase.initializeApp(firebaseConfig)

const app = express()
const port = process.env.PORT

app.use('/api', routes);

app.listen(port, () => console.log(`Listening on port ${port}!`))
=======
const colors = require('colors')
const firebase = require('firebase');
const env = require('dotenv').config()
const getIP = require('external-ip')();
const wpi = require('wiring-pi');

var bodyParser = require('body-parser')

//----------------
//Firebase config
//----------------
var config = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID
  };

firebase.initializeApp(config);
var jsonParser = bodyParser.json()

const app = express()
const port = 9000;

const gpioPIN = parseInt(process.env.PIN);

//------------------------------
//Write external ip to Firebase
//------------------------------
function writeIP() {
    var database = firebase.database();

    getIP((err, ip) => {
        if (err) {
            // every service in the list has failed
            console.log(err);
        }
        
        database.ref('/').set({
            ip: ip,
        }).then(function() {
            console.log(`${ip} written to DB`);
        }).catch(function() {
            console.log(`cannot write IP to DB`);
        });
    });
}

setInterval(writeIP, 60000);

//---------------
//Listen to port
//---------------
app.listen(port, () => {
    console.log('GARAGE DOOR OPENER'.rainbow.bold);
    console.log(colors.white.italic('Running on port'), colors.red.bold(`${port}`))
    
    //SET GPIO PIN TO OUT
    wpi.wiringPiSetupGpio();
    wpi.pinMode(gpioPIN, wpi.OUTPUT);
    console.log(`pin ${gpioPIN} set to OUT`);
    //monitorPin(gpioPIN);
})

//----------------------
//Trigger relay function
//----------------------
function triggerRelay(pin){
	console.log('Trying to trigger relay');

	wpi.wiringPiSetupGpio();
	
	wpi.digitalWrite(pin,0);
	setTimeout(function(){
		wpi.digitalWrite(pin, 1);
	}, 1500);
}

//---------------------------------------------------------------------------
//POST: localhost:9000/login with {"email": "YOUREMAIL", "pass": "YOURPASS"}
//---------------------------------------------------------------------------
app.post('/open', jsonParser, (req, res) => {
    console.log('Trying to log in with email', req.body.email);

    const email = req.body.email
    const pass = req.body.pass

    const auth = firebase.auth();

    const database = firebase.database();

    auth.signInWithEmailAndPassword(email, pass).then(function(){

        //Authorized
        console.log('200', 'Succesfully logged in with email', email)

        //Ready for lift off! 🚀
	triggerRelay(gpioPIN);

	//Write entry in DB
	const datetime = Date.now();

	database.ref('logs').set({
		lastOpen: datetime,
		openedBy: email,
	}).then(function(){
		console.log(`${email} opened the garage door`);
	}).catch(function(){
		console.log('Cannot write log to DB');
	});

        //Set status 200
        return res.sendStatus(200)

    }).catch(function(error) {

        //Unauthorized
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log('401', errorCode, errorMessage);
        return res.sendStatus(401)
      });
})

app.get('/', jsonParser, (req, res) => {
    console.log('Test')

    res.send('Test 123')
})

function monitorPin(pin){
    wpi.wiringPiSetupGpio();

    var pin = parseInt(pin);

    wpi.wiringPiISR(pin, wpi.INT_EDGE_BOTH, function(delta){
	console.log(`pin ${pin} changed.`);
    });
}
>>>>>>> d9beba7fadb5483c0408a9e5dce06ac23a02fc72
