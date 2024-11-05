import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import sendIcon from '../../../../assets/img/icons/send.png';
import homeIcon from '../../../../assets/img/icons/home.png';
import settingsIcon from '../../../../assets/img/icons/settings.png';
import logoutIcon from '../../../../assets/img/icons/logout.png';
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
          modelId: selectedModel,
        }),
      });
      
      const data = await response.json();
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Si Shift + Enter se presiona, añadir un salto de línea al mensaje.
        setMessage(prev => prev + '\n');
      } else {
        // Si solo Enter se presiona, enviar el mensaje.
        e.preventDefault(); // Prevenir el comportamiento por defecto de Enter (agregar un nuevo <br> en el textarea)
        handleSendMessage();
      }
    }
  };

  return (
    <div className="Chat">
      {/* Barra superior con accesos directos */}
      <div className="chat-header">
        <div className="header-item">
          <a href="/home"><img src={homeIcon} alt="Home" />Home</a>
        </div>
        <div className="header-item">
          <a href="/settings"><img src={settingsIcon} alt="Settings" />Settings</a>
        </div>
        <div className="header-item">
          <a href="/logout"><img src={logoutIcon} alt="Logout" />Logout</a>
        </div>
      </div>
      {/* Selector de modelos de IA */}
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
          onKeyDown={handleKeyDown} // Añadir el manejador de eventos
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
