const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const { User } = require('./models/user')
const { auth } = require('./middleware/auth')
const key = require('./config/key')

mongoose.connect(key.mongoURI, 
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false } ).then(() => console.log('DB connected')).catch(err => console.error(err))


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/api/user/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req._id,
		isAuth: true,
		email: req.user.email, 
		name: req.user.name,
		lastname: req.user.lastname, 
		role: req.user.role
	})
})

app.post('/api/users/register', async (req, res) => {
	const user = User(req.body)
	try {
		user.save()
		return res.json({ success: true })
	} catch(err) {
		return res.json({ success: false, err })
	}
})

app.post('/api/user/login', (req, res) => {
	// Find the email
	User.findOne({ email: req.body.email }, (err, user) => {
		if(!user)
		return res.json({
			loginSuccess: false, 
			message: "Auth failed, email not found"
			
		})
		// Compare password
				user.comparePassword(req.body.password, (err, isMatch) => {
					if (!isMatch) {
						return res.json({ loginSuccess: false, message: "wrong password" })
					}
				})
	
				// Generate Token  
				user.generateToken((err, user) => {
					if(err) return res.status.json(400).send(err)
					res.cookie("x_auth", user.token)
						 .status(200)
						 .json({
							 loginSuccess: true
						 })
				})
				})
})

// Logout Route
app.get('/api/user/logout', auth, (req, res) => {
	User.findOneAndUpdate({_id: req.user._id}, { token: ""}, (err, doc) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({ success: true })
	})
})

const port = process.env.PORT || 5000

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
