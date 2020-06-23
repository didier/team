const socket = io()
const loggedInUserId = document.querySelector('#user-id').value

socket.on('connect', () => {


	console.log('frame connected')
	// Handles new incoming messages
	console.log(loggedInUserId)
	socket.on('new message', (data) => {
		// Destructure message from data.message

		console.log('frame received data');

		console.log('frame:', data)
		const { userId, userName, message, roomId, participantId, participantName } = data
		// Render chat to the DOM
		// console.log
		if (userId === loggedInUserId) {
			renderChat('sent', message, userName)
		} else {
			renderChat('received', message, participantName)
		}
	})

	function renderChat(method, message, name) {
		const chatWindow = document.querySelector('.chat-window')

		const newMessage = document.createElement('li')
		newMessage.classList.add('chat-message')
		newMessage.classList.add(method)
		newMessage.innerHTML = `<p><span>${name}: </span>${message.toString()}</p>`

		if (method === 'receive') {
			// typeIndicator.classList.remove('active')
			// typeIndicator.addEventListener('transitionend', () => {
			chatWindow.appendChild(newMessage)
			newMessage.classList.add('active')
			// })
		} else {
			// typeIndicator.classList.remove('active')
			chatWindow.appendChild(newMessage)
			setTimeout(() => {
				newMessage.classList.add('active')
			}, 10)

		}

		setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200)
	}

})
