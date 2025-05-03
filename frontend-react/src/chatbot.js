import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';


const socket = io('http://localhost:3000'); // Connect to the backend server

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Handle incoming messages
  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  // Send a message
  const handleSend = async () => {
    if (inputText.trim()) {
      const message = { text: inputText, sender: 'user' };
      socket.emit('message', message); // Send the message to the server
      setInputText('');
    }
  };

  return (
    <div style={styles.chatbot}>
      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

// CSS styles (inline styles in React)
const styles = {
  chatbot: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  messages: {
    height: '300px',
    overflowY: 'auto',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#f1f1f1',
    color: 'black',
    alignSelf: 'flex-start',
  },
  inputArea: {
    display: 'flex',
  },
  input: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Chatbot;