
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emojies,setEmojies] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await axios.post('http://192.168.0.103:3000/api/ollama', {
          message: input,
        });
        const botMessage = { 
          text: response.data.response, 
          sender: 'bot', 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          text: 'Failed to get a response from the bot. Please try again later.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setInput('');
      }
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getEmojies = async() => {
    try {
      const response = await axios.get('http://192.168.0.103:3000/api/gif', {
        params: { q: input }
      });
      
      setEmojies(response.data)
    } catch (error) {
      console.error('Error fetching emojies:', error);
      const errorMessage = {
        text: 'Failed to get a response from giphy. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } 
  }
   
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue); 
    getEmojies();

  }
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="32" height="32" rx="8" fill="#1A1D21"/>
              {/* Chat Bubble Icon */}
              <path d="M22 10H10C8.89543 10 8 10.8954 8 12V18C8 19.1046 8.89543 20 10 20H12L14 22L16 20H22C23.1046 20 24 19.1046 24 18V12C24 10.8954 23.1046 10 22 10Z" fill="#00C4B4"/>
              {/* "AC" Text */}
              <text x="10" y="16" fill="#B0B0B0" fontSize="10" fontWeight="bold" fontFamily="system-ui">AC</text>
            </svg>
          </div>
          <span style={styles.appName}>Abhi_chat</span>
        </div>
        <div style={styles.menu}>
          <div style={styles.menuSection}>
            <span style={styles.menuTitle}>Main menu</span>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H21M9 9V21M15 9V21M3 3H21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Home</span>
            </div>
            <div style={{ ...styles.menuItem, background: 'rgba(255, 255, 255, 0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V16M8 12H16" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Settings</span>
            </div>
          </div>
          <div style={styles.menuSection}>
            <span style={styles.menuTitle}>Activity</span>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Chats</span>
            </div>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Tickets</span>
            </div>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Emails</span>
            </div>
          </div>
          <div style={styles.menuSection}>
            <span style={styles.menuTitle}>Set Up</span>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Chatbots</span>
            </div>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Ticket Forms</span>
            </div>
            <div style={styles.menuItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M12 3V21" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Email Inboxes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Account Center</h1>
          <p style={styles.headerSubtitle}>Let's get your account set up!</p>
          <div style={styles.settingsButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16M8 12H16" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.accountInfo}>
            <div style={styles.userAvatar}>
              <div style={styles.userAvatarInner}></div>
            </div>
            <div style={styles.accountDetails}>
              <span style={styles.accountName}>Abhi_chat</span>
              <span style={styles.accountRole}>Admin</span>
            </div>
            <div style={styles.accountActions}>
              <button style={styles.actionButton}>Account</button>
              <button style={styles.actionButton}>Settings</button>
            </div>
          </div>

          <div style={styles.chatSection}>
            <h2 style={styles.sectionTitle}>Chat Interface</h2>
            <div style={styles.chatWindow}>
              {messages.map((msg, index) => (
                <div key={index} style={{ 
                  ...styles.messageContainer, 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                }}>
                  {msg.sender === 'bot' && (
                    <div style={styles.avatarContainer}>
                      <div style={styles.botAvatar}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#1A1D21"/>
                          <path d="M7 12H17M7 8H17M7 16H13" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {msg.sender === 'user' && (
                    <div style={styles.timestamp}>{msg.timestamp}</div>
                  )}
                  
                  <div style={{ 
                    ...styles.message, 
                    ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage) 
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.sender === 'bot' && (
                    <div style={styles.timestamp}>{msg.timestamp}</div>
                  )}
                  
                  {msg.sender === 'user' && (
                    <div style={styles.avatarContainer}>
                      <div style={styles.userAvatar}>
                        <div style={styles.userAvatarInner}></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                style={styles.input}
              />
              <div style={styles.inputButtons}>
                <button style={styles.inputButton} onClick={() => {}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 8A3.5 3.5 0 0 0 12 4.5v7a3.5 3.5 0 0 0 3.5-3.5z" fill="#666666"/>
                    <path d="M12 4.5A3.5 3.5 0 0 0 8.5 8a3.5 3.5 0 0 0 3.5 3.5v-7z" fill="#666666"/>
                    <path d="M12 11.5v7a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-3.5-3.5z" fill="#666666"/>
                    <path d="M12 11.5A3.5 3.5 0 0 0 8.5 15a3.5 3.5 0 0 0 3.5 3.5v-7z" fill="#666666"/>
                  </svg>
                </button>
                <button style={styles.inputButton} onClick={handleVoiceInput}>
                  {listening ? 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" fill="#FF4A4A"/>
                    </svg> :
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="4" width="4" height="12" rx="2" fill="#666666"/>
                      <path d="M6 12a6 6 0 1 1 12 0v2a6 6 0 0 1-12 0v-2z" stroke="#666666" strokeWidth="2"/>
                      <path d="M12 18v4" stroke="#666666" strokeWidth="2"/>
                    </svg>
                  }
                </button>
                <div
                  style={styles.emojiBar}
                >
                  {emojies.gifUrl.map((gif, index) => (
                    <img key={index} src={gif} alt={`Emoji ${index}`} style={{ width: 50, height: 50, margin: 5 }} />
                  ))}
                </div>
                <button style={styles.sendButton} onClick={handleSend}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #0A0C10 0%, #1A1D21 100%)',
    color: '#B0B0B0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '250px',
    background: '#1A1D21',
    borderRight: '1px solid #2A2E35',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backdropFilter: 'blur(10px)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '30px',
  },
  logo: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #2A2E35, #1A1D21)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  appName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#B0B0B0',
    letterSpacing: '0.5px',
  },
  menu: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  menuSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  menuTitle: {
    fontSize: '12px',
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: '5px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    fontSize: '14px',
    color: '#B0B0B0',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    background: '#0A0C10',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#B0B0B0',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#666666',
  },
  settingsButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '8px',
    background: '#2A2E35',
    transition: 'background 0.3s ease',
  },
  content: {
    display: 'flex',
    gap: '20px',
  },
  accountInfo: {
    background: '#1A1D21',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '300px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  accountName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#B0B0B0',
  },
  accountRole: {
    fontSize: '14px',
    color: '#666666',
  },
  accountActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 16px',
    background: '#2A2E35',
    border: '1px solid #3A3E45',
    borderRadius: '8px',
    color: '#B0B0B0',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  chatSection: {
    flex: 1,
    background: '#1A1D21',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems:'center',
    height:'60vh'
    
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#B0B0B0',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '80%',
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #2A2E35, #1A1D21)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #00C4B4, #1A77F2)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  userAvatarInner: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00C4B4, #1A77F2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
    maxWidth: '100%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  userMessage: {
    background: 'linear-gradient(135deg, #00C4B4, #1A77F2)',
    color: '#E0E0E0',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    background: '#2A2E35',
    color: '#B0B0B0',
    borderBottomLeftRadius: '4px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666666',
    alignSelf: 'flex-end',
    marginBottom: '4px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
    margin: '10px',
    width:'500px'
  },
  input: {
    padding: '12px 16px',
    background: '#2A2E35',
    color: '#B0B0B0',
    border: '1px solid #3A3E45',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '8px',
    width: '100%',
    transition: 'border 0.3s ease',
  },
  inputButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    transition: 'opacity 0.3s ease',
  },
  sendButton: {
    background: 'linear-gradient(135deg, #00C4B4, #1A77F2)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.3s ease',
  },
  emojiBar:{

  }
};