// Add a global array to store messages
const messages = [];

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    appendMessage('user', userInput);

    // Log the user message
    const userMessage = { sender: 'user', message: userInput };
    messages.push(userMessage);
    logToFile(userMessage);

    // Call the backend to process the message and get a response from GPT-3.5
    fetch('/process_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.bot_response;
        appendMessage('bot', botResponse);

        // Log the bot response
        const botMessage = { sender: 'bot', message: botResponse };
        messages.push(botMessage);
        logToFile(botMessage);
    });
}

function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
}

function logToFile(message) {
    const logString = `${message.sender}: ${message.message}\n`;
    const blob = new Blob([logString], { type: 'text/plain' });

    const file = new File([blob], 'logs.txt', { type: 'text/plain' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'logs.txt';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
