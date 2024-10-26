// Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import sendIcon from '../../../../assets/img/icons/send.png';
import ModelSelector from '../ModelSelector/ModelSelector';

function Chat() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('amazon.titan-text-express-v1');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:1234/bedrock/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setModels(data.models);
      } catch (error) {
        console.error('Error fetching models:', error);
        setResponses(prev => [
          ...prev,
          { message: 'Error loading models. Please refresh the page.', isError: true }
        ]);
      }
    };
    fetchModels();
  }, []);

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setResponses(prev => [...prev, { message: message.trim(), isUser: true }]);
    setMessage('');
    textareaRef.current.style.height = 'auto';

    try {
      const response = await fetch('http://localhost:1234/bedrock/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: message.trim(),
          modelId: selectedModel, // Utiliza el modelo seleccionado
        }),
      });
      
      const data = await response.json();
      console.log(data)
      if (typeof data.response === 'string') {
        const responseMessages = data.response
          .split(',')
          .map(msg => msg.trim().replace(/^"|"$/g, ''))
          .filter(msg => msg);

        setResponses(prev => [
          ...prev,
          ...responseMessages.map(msg => ({ message: msg, isUser: false }))
        ]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponses(prev => [
        ...prev,
        { message: 'Error sending message. Please try again.', isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Chat">
      <ModelSelector 
        models={models} 
        selectedModel={selectedModel}
        onModelChange={handleModelChange} 
      />
      <div className="responses-view">
        <div className="message-container">
          {responses.map((response, index) => (
            <div
              key={index}
              className={`message-item ${
                response.isUser 
                  ? 'user-message' 
                  : response.isError 
                  ? 'error-message' 
                  : 'server-message'
              }`}
            >
              {response.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="form-chat">
        <textarea
          ref={textareaRef}
          className="input-send"
          placeholder="Send a message..."
          value={message}
          onChange={handleMessageChange}
          rows={1}
        />
        <button 
          className="button-send" 
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          <span>Send</span>
          <img src={sendIcon} alt="Send" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
