const express = require('express')

const env = require('dotenv').config()
const firebase = require('firebase')
const publicIp = require('public-ip');
const { exec } = require('child_process');

const firebaseConfig = require('./firebaseConfig')
const routes = require('./routes/routes')

const firebaseApp = firebase.initializeApp(firebaseConfig.config)
const database = firebase.database();

const app = express()
const port = process.env.PORT

app.use('/api', routes);

const interval  = 60000;
const interval2 = 2000;

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

function checkIfOpen() {
	// GPIO PIN 15
	exec('gpio -g read 15', (error, stdout, stderr) => {
		const isOpen = parseInt(stdout) === 1 ? 'closed' : 'open';

		database.ref('status').set({
			isOpen
		})
	});

	setTimeout(checkIfOpen, interval2);
}

getIP();
checkIfOpen();

app.listen(port, () => console.log(`Listening on port ${port}!`))
