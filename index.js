require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const io = require('socket.io')
const multer = require('multer')
const session = require('express-session')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const {
	Read,
	Create
} = require('./src/db')

const {
	DB_USER,
	DB_PASSWORD,
	DB_URL,
	DB_NAME
} = process.env

const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`

app
	.use(express.static('public'))
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.set('view engine', 'ejs')
	.set('views', 'src/views')
	.get('/', async (req, res) => {

		const query = req.body || {}

		console.log(query)

		const users = await Read({
			collection: 'users',
			query: query
		})

		res
			.status(200)
			.render('index', {
				users
			})
	})

	.post('/', async (req, res) => {

		const response = req.body || {}

		const age = parseInt(req.body.age);
		const orientation = req.body.orientation;

		console.log('Orientation:', orientation)

		const query = {
			$and: [
				{
					age: {
						$lte: age
					}
				},
				orientation === 'x' ? {} : {
					gender: {
						$eq: orientation
					}
				}
			]
		}
		console.log(JSON.stringify(query))

		const users = await Read({
			collection: 'users',
			query,
		})


		console.log(users)
		res
			.status(200)
			.render('index', {
				users
			})
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


	.listen(port, () => {
		console.log(`App is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
		console.log('—————————————————————————————————————————————————————————')
	})
