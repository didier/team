const { Create, Read, Update } = require("./db")
const { ObjectId } = require("mongodb")

module.exports = io => {

	io.on('connection', (socket) => {
		console.log('a user connected')
		socket.on('disconnect', () => {
			console.log('user disconnected')
		})

		socket.on('joined', roomId => {
			socket.join(roomId)
			console.log(`you're now in room ${roomId}`)
		})

		socket.on('new message', async (data) => {
			const { userId, message, roomId } = data
			socket.to(roomId).broadcast.emit('new message', data)
			// console.log(roomId)
			const chat = await Read({
				collection: 'chats',
				query: {
					_id: roomId
				}
			})

			console.log(chat)

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
			// console.log(chat)
			console.log(data)
		})


	})
}
