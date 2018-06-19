const express = require('express')
const colors = require('colors')
const firebase = require('firebase');
const env = require('dotenv').config()
const getIP = require('external-ip')();

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
        
        firebase.database().ref('/').set({
            ip: ip,
        }).then(function() {
            console.log(`${ip} written to DB`);
        }).catch(function() {
            console.log(`connot write IP to DB`);
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

//---------------------------------------------------------------------------
//POST: localhost:9000/login with {"email": "YOUREMAIL", "pass": "YOURPASS"}
//---------------------------------------------------------------------------

app.post('/login', jsonParser, (req, res) => {
    console.log('Trying to log in with email', req.body.email);

    const email = req.body.email
    const pass = req.body.pass

    firebase.auth().signInWithEmailAndPassword(email, pass).then(function(){

        //Authorized
        console.log('200', 'Succesfully logged in with email', email)
        return res.sendStatus(200)
    }).catch(function(error) {

        //Unauthorized
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log('403', errorCode, errorMessage);
        return res.sendStatus(401)
      });
})

app.post('/open', jsonParser, (req, res) => {
    console.log('Open')

    res.send('Will open! 👛')
})