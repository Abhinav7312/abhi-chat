// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      // Send message to Hugging Face API route
      const response = await axios.post('localhost/api/ollama', {
        message: input,
      });
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);

      setInput('');
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setListening(false);
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.message, ...styles[msg.sender] }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
        <button onClick={handleVoiceInput} style={styles.button}>
          {listening ? 'Listening...' : '🎤'}
        </button>
      </div>
    </div>
  );
}

// CSS-in-JS styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  message: {
    margin: '5px 0',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
  },
  user: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#e9ecef',
    color: 'black',
    alignSelf: 'flex-start',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};