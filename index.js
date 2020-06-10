import { Session } from 'express-session';
require('dotenv').config()

const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const router = require('./src/router')

const { PORT, NODE_ENV, SESSION_SECRET } = process.env
const port = PORT || 3000

app
	.use(express.static('public'))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(session({ 'secret': SESSION_SECRET }))
	.set('view engine', 'ejs')
	.set('views', 'src/views')
	.use(router)
	.listen(port, () => {
		console.log(`App is running in ${NODE_ENV} mode on http://localhost:${port}`)
		console.log('—————————————————————————————————————————————————————————')
	})
