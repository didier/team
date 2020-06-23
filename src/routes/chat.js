// Server side chat function

const { Create, Read, Update } = require('../db')
const { ObjectId } = require('mongodb')

const getChat = async (req, res) => {


	const user = await Read({
		collection: 'users',
		query: {
			_id: ObjectId(req.params.userId)
		}
	})

	const roomId = [req.session.user._id, req.params.userId].sort().toString().replace(',', '')

	console.log('roomId :>>', roomId);

	const chatData = await Read({
		collection: 'chats',
		query: { _id: roomId }
	})


	if (chatData.length === []) {
		await Create({
			collection: 'chats',
			data: {
				_id: roomId,
				messages: []
			}
		})
	}

	const chats = chatData[0].messages

	res.status(200).render('chat', { user: user[0], roomId, loggedInUser: req.session.user, chats })
}

const getChatFrame = async (req, res) => {


	const user = await Read({
		collection: 'users',
		query: {
			_id: ObjectId(req.params.userId)
		}
	})

	const roomId = [req.session.user._id, req.params.userId].sort().toString().replace(',', '')

	console.log('roomId :>>', roomId);

	const chatData = await Read({
		collection: 'chats',
		query: { _id: roomId }
	})


	if (chatData.length === []) {
		await Create({
			collection: 'chats',
			data: {
				_id: roomId,
				messages: []
			}
		})
	}

	const chats = chatData[0].messages

	res.status(200).render('frame', { user: user[0], roomId, loggedInUser: req.session.user, chats })
}


const postChat = async (req, res) => {
	try {
		console.log(req.body)
		const { message, roomId, userId, participantId } = req.body

		const chats = await Read({
			collection: 'chats',
			query: {
				_id: roomId
			}
		})

		const user = await Read({
			collection: 'users',
			query: { _id: userId }
		})

		// When no chats are found, create chat object for respective room
		if (chats.length === 0) {
			await Create({
				collection: 'chats', data: {
					_id: roomId,
					messages: [{
						message,
						userId
					}]
				}
			})
		} else {
			// If chats are found, update chats array with new messages
			await Update({
				collection: 'chats',
				query: {
					_id: roomId
				},

				data: {
					$push: {
						messages: {
							message,
							userId
						}
					}
				}
			}
			)
		}

		res.status(200).redirect(`/chat/${participantId}`)
	} catch (error) {
		throw new Error(error)
	}
}
module.exports = { getChat, getChatFrame, postChat }
