const API_KEY = "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";
const submitButton = document.querySelector('#submit');
const mainSection = document.querySelector('.main');
const inputElement = document.querySelector('#userInput');
const typingIndicator = document.querySelector('.typing-indicator');

let conversationHistory = [];

function changeInput(value) {
  inputElement.value = value;
}

async function getMessage() {
  if (inputElement.value.trim() === '') {
    return;
  }

  try {
    const userQuery = inputElement.value.trim();
    conversationHistory.push({ role: 'user', content: userQuery });
    showConversationHistory();
    inputElement.value = '';

    showTypingIndicator();

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-0125-preview",
        messages: conversationHistory.map(({ role, content }) => ({ role, content })),
        max_tokens: 100
      })
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);

    hideTypingIndicator();

    const botResponse = data.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: botResponse });
    showConversationHistory();
  } catch (error) {
    console.error(error);
  }
}

submitButton.addEventListener('click', getMessage);

inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    getMessage();
  }
});

function clearInput() {
  inputElement.value = '';
}

submitButton.addEventListener('click', clearInput);

function showConversationHistory() {
  conversationHistory.forEach(({ role, content }, index) => {
    // Check if the chat bubble already exists
    const existingChatBubble = document.getElementById(`chatBubble_${index}`);
    if (existingChatBubble) {
      return; // Skip if the chat bubble already exists
    }

    const chatBubble = createChatBubble(role, content);
    chatBubble.id = `chatBubble_${index}`;
    mainSection.appendChild(chatBubble);
  });
  scrollToBottom();
}

function showTypingIndicator() {
  const typingIndicatorBubble = createChatBubble('typing-indicator', '...');
  mainSection.appendChild(typingIndicatorBubble);
  scrollToBottom();
}

function hideTypingIndicator() {
  const typingIndicatorBubble = document.querySelector('.typing-indicator');
  if (typingIndicatorBubble && typingIndicatorBubble.parentNode === mainSection) {
    mainSection.removeChild(typingIndicatorBubble);
  }
}

function createChatBubble(role, content) {
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('chat-bubble');
  chatBubble.classList.add(role);
  chatBubble.textContent = content;

  if (role === 'assistant') {
    chatBubble.classList.add('bot-reply');
  }

  return chatBubble;
}

function scrollToBottom() {
  mainSection.scrollTop = mainSection.scrollHeight;
}
