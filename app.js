const express = require('express')
const colors = require('colors')
const firebase = require('firebase');
const env = require('dotenv').config()
var bodyParser = require('body-parser')


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

app.listen(port, () => {
    console.log('GARAGE DOOR OPENER'.rainbow.bold);
    console.log(colors.white.italic('Running on port'), colors.red.bold(`${port}`))
})


app.get('/', (req, res) => {
    console.log('Home')

    res.send('Welcome home')
})

//POST: localhost:9000/login with {"email": "YOUREMAIL", "pass": "YOURPASS"}
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