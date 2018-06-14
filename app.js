const express = require('express')
const colors = require('colors')
const firebase = require('firebase');
const env = require('dotenv').config()

var config = {
    apiKey: env.APIKEY,
    authDomain: env.AUTHDOMAIN,
    databaseURL: env.DATABASEURL,
    projectId: env.PROJECTID,
    storageBucket: env.STORAGEBUCKET,
    messagingSenderId: env.MESSAGINGSENDERID
  };
firebase.initializeApp(config);


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

app.get('/open', (req, res) => {
    console.log('Open')

    res.send('Will open! 👛')
})