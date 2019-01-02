const express = require('express')

const env = require('dotenv').config()
const firebase = require('firebase')
const publicIp = require('public-ip');

const firebaseConfig = require('./firebaseConfig')
const routes = require('./routes/routes')

const firebaseApp = firebase.initializeApp(firebaseConfig.config)
const database = firebase.database();

const app = express()
const port = process.env.PORT

app.use('/api', routes);

const interval = 60000;

async function getIP() {
	try {
		const ip = await publicIp.v4();

		database.ref('ip').set({
			ip
		}).then(function(){
			console.log('IP', `${ip} written to DB`);
		});
	} catch (err) {
		console.log(err);
	}

	setTimeout(getIP, interval);
}

getIP();

app.listen(port, () => console.log(`Listening on port ${port}!`))
