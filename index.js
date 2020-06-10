require('dotenv').config()

const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const router = require('./src/router')

const port = process.env.PORT || 3000

app
	.use(express.static('public'))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(session({ 'secret': 'vdjifvjdiovjodjvodjfvjodivo' }))
	.set('view engine', 'ejs')
	.set('views', 'src/views')
	.use(router)
	.listen(port, () => {
		console.log(`App is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
		console.log('—————————————————————————————————————————————————————————')
	})
