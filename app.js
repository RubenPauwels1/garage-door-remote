const express = require('express')

const env = require('dotenv').config()
const firebase = require('firebase')

const firebaseConfig = require('./firebaseConfig')
const routes = require('./routes/routes')

const firebaseApp = firebase.initializeApp(firebaseConfig.config)

const app = express()
const port = process.env.PORT

app.use('/api', routes);

app.listen(port, () => console.log(`Listening on port ${port}!`))
