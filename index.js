require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const io = require('socket.io')
const multer = require('multer')
const session = require('express-session')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const { Read } = require('./src/db')

const { DB_USER, DB_PASSWORD, DB_URL, DB_NAME } = process.env

const URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`


app
	.use(express.static('public'))
	.set('view engine', 'ejs')
	.set('views', 'src/views')
	.get('/', async (req, res) => {

		const users = await Read({
			collection: 'users',
			query: { age: { $lt: 23 } },
			amount: 1
		})

		res
			.status(200)
			.render('index', {
				users
			})
	})
	.listen(port, () => {
		console.log(`App is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
		console.log('—————————————————————————————————————————————————————————')
	})
