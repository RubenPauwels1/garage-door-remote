const express = require('express')
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

//------------------------------
//Write external ip to Firebase
//------------------------------
function writeIP() {
    var database = firebase.database();

    getIP((err, ip) => {
        if (err) {
            // every service in the list has failed
            throw err;
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
})

app.get('/testgpio', (req, res ) => {
    console.log('TESTING GPIO');
    console.log('SETTING THINGS UP');
    wpi.wiringPiSetupGpio();
    /*const { exec } = require('child_process');
    exec('node -v', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });*/
    console.log('DONE');
    console.log('SETTING UP PIN');
    //wpi.pinMode(14, 'OUT');
    console.log('DONE');
    console.log('ENABLING PIN');
    wpi.digitalWrite(14, 0);
    console.log('DISABLING PIN');
    setTimeout(function(){
       wpi.digitalWrite(14, 1);
    }, 1500);
    console.log('DONE');
    return res.sendStatus(200);
});

//---------------------------------------------------------------------------
//POST: localhost:9000/login with {"email": "YOUREMAIL", "pass": "YOURPASS"}
//---------------------------------------------------------------------------
app.post('/open', jsonParser, (req, res) => {
    console.log('Trying to log in with email', req.body.email);

    const email = req.body.email
    const pass = req.body.pass

    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, pass).then(function(){

        //Authorized
        console.log('200', 'Succesfully logged in with email', email)

        //Ready for lift off! 🚀

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
