const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const { User } = require('./models/user')
 const key = require('./config/key')
mongoose.connect(key.mongoURI, 
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } ).then(() => console.log('DB connected')).catch(err => console.error(err))


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({ "hello ~": "Hi ~~ sadlsasdkd "})
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

app.listen(5000);
