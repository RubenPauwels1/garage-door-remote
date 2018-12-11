const { exec, spawn } = require('child_process')

module.exports = {
	open: (req, res) => {
		const number = req.body.number

		spawn('python', ["../py/toggle.py", 0])
		console.log('Done toggling');

		// exec('ls', (err, stdout, stderr) => {
		// 	if (err) {
		// 	  // node couldn't execute the command
		// 	  return;
		// 	}
		  
		// 	res.status(200).send('Done!')
		//   });
	}
}