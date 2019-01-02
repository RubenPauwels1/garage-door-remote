const { exec } = require('child_process');
const firebase = require('firebase');

module.exports = {
	open: (req, res) => {
		// GPIO PIN 18
		const email = req.body.email;
		const pass = req.body.pass;

		const auth = firebase.auth();
		const database = firebase.database();

		if( email && pass ) {
			console.log('Trying to log in with email', email);

			auth.signInWithEmailAndPassword(email, pass).then( function() {
				console.log('200', `Succesfully logged ${email} in!`);

				toggleRelay();
				
			}).catch(function() {
				console.log('403', `Cannot log ${email} in.`);
				return res.status(403).send('Cannot login: Are you sure your email and password are correct?');
			})
		} else {
			return res.status(403).send('Are you sure you have given credentials in the body?');
		}

		
	},
	isopen: (req, res) => {
		// GPIO PIN 15
		exec('gpio -g read 15', (error, stdout, stderr) => {
			const isOpen = parseInt(stdout) === 1 ? 'closed' : 'open';
			console.log(`The garagedoor is currently ${isOpen}`);

			res.status(200).send(isOpen);
		});
	}
}


function toggleRelay() {
	exec('gpio -g mode 18 out', (error, stdout, stderr) => {
		if (error) {
			console.log('Cannot set MODE to OUT on GPIO 18', error);
			res.status(500).send('Cannot set MODE to OUT, see the server logs for more info.');
		}

		if (stderr) {
			console.log('Cannot set MODE to OUT on GPIO 18', stderr);
							res.status(500).send('Cannot set MODE to OUT, see the server logs for more info.');
		}
	});

	exec('gpio -g write 18 1', (error, stdout, stderr) => {
		if (error) {
			console.log('Cannot WRITE 1 on GPIO 18', error);
							res.status(500).send('Cannot set pin to high, see the server logs for more info.');
		}

		if (stderr) {
			console.log('Cannot write 1 on GPIO 18', error);
							res.status(500).send('Cannot set pin to high, see the server logs for more info.');
		}
	});
	setTimeout(() => {
		exec('gpio -g write 18 0', (error, stdout, stderr) => {
			if (error) {
								console.log('Cannot WRITE 0 on GPIO 18', error);
								res.status(500).send('Cannot set pin to low, see the server logs for more info.');
						}

						if (stderr) {
								console.log('Cannot write 0 on GPIO 18', error);
								res.status(500).send('Cannot set pin to low, see the server logs for more info.');
						}

			console.log('Toggled the garagedoor');
			return res.status(200).send('Done');
		});
	}, 150);
}