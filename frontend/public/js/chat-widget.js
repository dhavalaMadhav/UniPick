// Live Chat Widget
class ChatWidget {
    constructor() {
        this.sessionId = localStorage.getItem('chatSessionId');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();

        // Check for existing session
        if (this.sessionId) {
            this.loadMessages();
        }
    }

    createWidget() {
        const widgetHTML = `
            <div id="chat-widget" class="chat-widget">
                <button id="chat-toggle" class="chat-toggle">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge">1</span>
                </button>
                
                <div id="chat-window" class="chat-window" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <h4><i class="fas fa-comments"></i> Live Career Guidance</h4>
                        </div>
                        <button id="chat-close" class="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="chat-messages" class="chat-messages"></div>
                    
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="Type your message..."
                            autocomplete="off"
                        >
                        <button id="chat-send" class="chat-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    
                    <div id="chat-form" class="chat-form" style="display: none;">
                        <h4>Start Chat</h4>
                        <input type="text" id="chat-name" placeholder="Your Name *" required>
                        <input type="email" id="chat-email" placeholder="Email *" required>
                        <input type="tel" id="chat-phone" placeholder="Phone *" required pattern="[0-9]{10}">
                        <button id="chat-start" class="chat-start-btn">Start Chat</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        document.getElementById('chat-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        document.getElementById('chat-close').addEventListener('click', () => this.closeChat());
        document.getElementById('chat-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            const chatWidget = document.getElementById('chat-widget');
            const chatWindow = document.getElementById('chat-window');
            if (this.isOpen && chatWidget && !chatWidget.contains(e.target)) {
                this.closeChat();
            }
        });

        // Prevent clicks inside chat window from closing it
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        const startBtn = document.getElementById('chat-start');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startSession());
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatForm = document.getElementById('chat-form');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatWindow.style.display = 'flex';

            if (!this.sessionId) {
                chatForm.style.display = 'block';
            } else {
                chatForm.style.display = 'none';
                document.getElementById('chat-input').focus();
            }

            // Hide badge
            const badge = document.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-window').style.display = 'none';
    }

    async startSession() {
        const name = document.getElementById('chat-name').value.trim();
        const email = document.getElementById('chat-email').value.trim();
        const phone = document.getElementById('chat-phone').value.trim();

        if (!name || !email || !phone) {
            alert('Please fill all fields');
            return;
        }

        if (phone.length !== 10) {
            alert('Please enter valid 10-digit phone number');
            return;
        }

        try {
            const response = await fetch('/api/chat/session/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName: name, studentEmail: email, studentPhone: phone })
            });

            const data = await response.json();

            if (data.success) {
                this.sessionId = data.sessionId;
                localStorage.setItem('chatSessionId', this.sessionId);

                document.getElementById('chat-form').style.display = 'none';
                this.loadMessages();
            }
        } catch (error) {
            console.error('Error starting session:', error);
            alert('Error starting chat. Please try again.');
        }
    }

    async loadMessages() {
        try {
            const response = await fetch(`/api/chat/messages/${this.sessionId}`);
            const data = await response.json();

            if (data.success) {
                const messagesDiv = document.getElementById('chat-messages');
                messagesDiv.innerHTML = '';

                data.messages.forEach(msg => {
                    this.displayMessage(msg.message, msg.sender);
                });

                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Display user message immediately
        this.displayMessage(message, 'student');
        input.value = '';

        try {
            const response = await fetch('/api/chat/message/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    message: message,
                    sender: 'student'
                })
            });

            const data = await response.json();

            if (data.success) {
                // Display bot/admin reply
                const lastMessage = data.messages[data.messages.length - 1];
                if (lastMessage.sender !== 'student') {
                    setTimeout(() => {
                        this.displayMessage(lastMessage.message, lastMessage.sender);
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    displayMessage(message, sender) {
        const messagesDiv = document.getElementById('chat-messages');
        const messageClass = sender === 'student' ? 'user-message' : 'bot-message';

        const messageHTML = `
            <div class="chat-message ${messageClass}">
                <div class="message-content">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    scrollToBottom() {
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Initialize chat widget when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
