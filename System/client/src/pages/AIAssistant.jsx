import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faRobot } from '@fortawesome/free-solid-svg-icons';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your Smart Agriculture AI Assistant. How can I help you today with your farming and agricultural needs?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response (to be replaced with actual API call later)
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'This is a placeholder response. The AI integration will be added later.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="bg-white p-4 border-b">
        <h1 className="text-xl font-bold text-green-800 flex items-center">
          <FontAwesomeIcon icon={faRobot} className="mr-2 text-green-600" />
          Smart Agriculture AI Assistant
        </h1>
        <p className="text-sm text-gray-500">Ask me anything about farming, crops, weather, or agricultural practices.</p>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <div
                  className={`text-xs mt-1 text-right ${
                    msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-md p-3 rounded-lg bg-white border border-gray-200 rounded-tl-none">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSpinner} className="text-green-600 mr-2 animate-spin" />
                  <span className="text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`px-4 rounded-r-lg flex items-center ${
                !message.trim() || isLoading
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
