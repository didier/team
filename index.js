require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const io = require('socket.io')
const multer = require('multer')
const session = require('express-session')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const { Read, Create } = require('./src/db')
const bcrypt = require('bcrypt')
const { DB_USER, DB_PASSWORD, DB_URL, DB_NAME, SESSION_KEY} = process.env

const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`

app
	.use(express.static('public'))
	.use(bodyParser.urlencoded({ extended: true }))
	.use( session({"secret": "vdjifvjdiovjodjvodjfvjodivo"}))
	.set('view engine', 'ejs')
	.set('views', 'src/views')
	.get('/', validateSession, async (req, res) => {

		const users = await Read({
			collection: 'users',
			query: { age: { $lt: 23 } },
			amount: 0
		})

		res
			.status(200)
			.render('index', {
				users,
				title: 'Dating App'
			})
	})
	.get('/login', (req, res) => {
		res.status(200).render('login', {
			title: 'Login',
			signUp: false
		})
	})
	.get('/signup', (req, res) => {
		res.status(200).render('login', {
			title: 'Sign Up',
			signUp: true
		})
	})
	.post('/login', async (req, res) => {
		const data = req.body

		const results = await Read({
			collection: 'users',
			query: {
				email: {
					$eq: data.email
				}
			}
		})


		req.session.user = { ...results[0] };
		console.log('Session-data:')
		console.log(req.session.user)

		if (results.length === 0) {
			res.render('login', { signUp: false, errorMessage: 'No user was found with that that e-mail. Would you like to <a href="/signup">sign up?</a>' })
			return
		}

		bcrypt.compare(data.pass, results[0].pass, (err, result) => {
			console.log('Results:', result)

			if (err) { throw err }

			if (result) {
				res.status(301).redirect('/')
			} else {
				res.status(401).redirect('/login')
			}
		})
	})
	.post('/signup', async (req, res) => {
		const data = req.body
		data.age = parseInt(data.age)

		const doesUserExist = await Read({
			collection: 'users',
			query: {
				email: {
					$eq: data.email
				}
			}
		})

		if (doesUserExist.length > 0) {
			res.render('login', { signUp: true, errorMessage: 'User already exists with that e-mail. Would you like to <a href="/login">log in?</a>' })
			return
		}


		bcrypt.hash(data.pass, 10, async (err, hash) => {
			data.pass = hash

			await Create({
				collection: 'users',
				data
			})
		})

		res.status(200).redirect('/')
	})

	.post('/login', async (req, res) => {
		const data = req.body
		console.log(data)


		const user = await Read({
			collection: 'users', query: {
				email: req.body.email
			}
		})

		console.log(user)
	})
	.post('/add', async (req, res) => {
		const data = req.body

		if (data) {
			console.log(data)
		}

		await Create({
			collection: 'users',
			data
		})

		res.status(200).render('add')
	})

	.post('/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/login')
	})

	.listen(port, () => {
		console.log(`App is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
		console.log('—————————————————————————————————————————————————————————')
	})



function validateSession(req, res, next) {
	if(req.session.user){
		next()
	}else{
		res.redirect('/login')
	}
}
