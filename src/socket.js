const { Create, Read, Update } = require("./db")
const { ObjectId } = require("mongodb")

module.exports = io => {
	// Fires when a user connects
	io.on('connection', (socket) => {
		// Fires when a user disconnects
		socket.broadcast.emit('user online', { status: true })
		socket.on('disconnect', () => {
			console.log('user disconnected')
			socket.broadcast.emit('user online', { status: false })
		})

		// Fires when a user joins the chat
		socket.on('joined', roomId => {
			// send user to their respective `roomId`
			// console.log('user online');
			socket.join(roomId)
			console.log(`you're now in room ${roomId}`)
		})

		// Broadcast to participant that user is typing
		socket.on('user typing', () => {
			socket.broadcast.emit('user typing')
			// console.log('someone is typing');
		})

		// Detects new messages
		socket.on('new message', async (data) => {
			// Destructure from data
			const { userId, message, roomId } = data
			console.log('server:', { ...data })
			// Make the message known to all users in the room except the sender (usually just the other participant)
			// socket.broadcast.to(roomId).emit('new message', { ...data })
			socket.broadcast.emit('new message', data)

			// Get chats from database
			const chat = await Read({
				collection: 'chats',
				query: {
					_id: roomId
				}
			})
			// When no chats are found, create chat object for respective room
			if (chat.length === 0) {
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
		})
	})
}

// Nice indent hell up there ↑
