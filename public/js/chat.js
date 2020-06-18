// Client side chat functionality
const socket = io()

socket.on('connect', () => {

	const form = document.querySelector('form')
	const messageInput = document.querySelector('#message')

	const roomId = document.querySelector('#room-id').value
	const userId = document.querySelector('#user-id').value

	console.log('CLIENT roomId:', roomId)
	socket.emit('joined', roomId)
	form.addEventListener('submit', event => {
		event.preventDefault()

		const message = messageInput.value
		if (messageInput.value === '') return

		socket.emit('new message', { userId, message, roomId })

		renderChat('sent', message)
		form.reset()
	})

	socket.on('new message', (data) => {
		// console.log('message data:', data);
		const { message } = data
		renderChat('received', message)

		console.log('CLIENT:', data)
	})

	function renderChat(method, message) {
		const chatWindow = document.querySelector('.chat-window')

		const newMessage = document.createElement('div')
		newMessage.classList.add('chat-message')
		newMessage.classList.add(method)
		newMessage.innerHTML = `<p>${message.toString()}</p>`

		if (method === 'receive') {
			// typeIndicator.classList.remove('active')
			// typeIndicator.addEventListener('transitionend', () => {
			chatWindow.appendChild(newMessage)
			newMessage.classList.add('active')
			// })
		} else {
			chatWindow.appendChild(newMessage)
			newMessage.classList.add('active')
		}
	}

});
