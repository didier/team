// Client side chat functionality
const socket = io()

socket.on('connect', () => {
	// document.querySelector('ul').style.display = 'flex'

	// Register DOM elements as variables
	const form = document.querySelector('.chat-form')
	const messageInput = document.querySelector('#message')

	const roomId = form.querySelector('#room-id').value
	const userId = form.querySelector('#user-id').value
	const participantId = form.querySelector('#participant-id').value
	const participantName = form.querySelector('#participant-name').value

	const typeIndicator = document.querySelector('.type-indicator')
	const statusIndicator = document.querySelector('.status-indicator')

	// Join keyed room
	console.log('CLIENT roomId:', roomId)
	socket.emit('joined', roomId)

	socket.on('user online', ({ status }) => {
		status === true
			? statusIndicator.classList.add('active')
			: statusIndicator.classList.remove('active')
	})

	// Listen for submit events
	form.addEventListener('submit', event => {
		// Prevent refresh when the form is submitted
		event.preventDefault()

		// Gets the value of the message field, if it's empty don't submit.
		const message = messageInput.value
		if (messageInput.value === '') return

		// Send message to the server
		socket.emit('new message', {
			userId,
			message,
			roomId,
			participantId,
			participantName
		})

		// Render the new chat message to the DOM
		// renderChat('sent', message, userName)
		console.log('youve come this far...')
		// Clear out the form
		form.reset()
	})

})


// Send typing events
form.addEventListener('input', event => {
	event.preventDefault()

	// Check if user is deleting text
	if (event.inputType.includes('delete')) {
		return
	}

	// Check if text is empty, send typing event
	if (event.target.value !== '') {
		console.log('typing...')
		socket.emit('user typing')
	}
})



// Recieve type events
socket.on('user typing', () => {
	console.log('participant is typing')

	if (typeIndicator.classList.contains('active')) {

	} else {
		typeIndicator.classList.add('active')
		setTimeout(() => {
			typeIndicator.classList.remove('active')
		}, 2000);
	}
})
