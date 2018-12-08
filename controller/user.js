module.exports = {
    postGetToken : (req, res) => {
		console.log('Trying to log in with email', req.body.email);
		res.status(200).send('YOUR TOKEN WILL BE SHOWN HERE')
	},
}