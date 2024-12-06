import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Chat.css";
import ModelSelector from "../ModelSelector/ModelSelector";

// Configuration and constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1234';
const MAX_MESSAGES_PER_MINUTE = 10;

function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("amazon.titan-text-express-v1");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [deviceAvailable, setDeviceAvailable] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Authentication effect
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        addResponse(`Error in speech recognition: ${event.error}`, true);
        setIsRecording(false);
      };
    } else {
      addResponse("Speech recognition not supported in this browser", true);
    }
  }, []);

  // Auto-scroll on responses change
  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  // Reset message count every minute
  useEffect(() => {
    const timer = setTimeout(() => setMessageCount(0), 60000);
    return () => clearTimeout(timer);
  }, [messageCount]);

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bedrock/models`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { models } = await response.json();
        setModels(models || []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        addResponse(`Error loading models: ${error.message}`, true);
      }
    };
    fetchModels();
  }, []);

  // Google Sign In
  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      addResponse(`Sign-in error: ${error.message}`, true);
    }
  };

  // Check audio devices availability
  const checkAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioDevice = devices.some(device => device.kind === 'audioinput');
      setDeviceAvailable(hasAudioDevice);

      if (!hasAudioDevice) {
        addResponse("No microphone detected. Please connect a microphone and reload the page.", true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Audio device check error:', error);
      addResponse("Could not verify microphone availability.", true);
      return false;
    }
  };

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const hasDevice = await checkAudioDevices();
      if (!hasDevice) return false;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      
      const errorMessages = {
        'NotFoundError': "No microphone found. Please check if it's connected correctly.",
        'NotAllowedError': "Microphone access denied. Please allow microphone access in your browser settings.",
        'NotReadableError': "Microphone is in use by another application. Please close other apps using the microphone."
      };

      const errorMessage = errorMessages[error.name] || `Microphone access error: ${error.message}`;
      addResponse(errorMessage, true);

      setHasPermission(false);
      return false;
    }
  };

  // Add response to chat
  const addResponse = (text, isError = false, isUser = false) => {
    setResponses((prev) => [...prev, { message: text, isError, isUser }]);
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Rate limiting
    if (messageCount >= MAX_MESSAGES_PER_MINUTE) {
      addResponse("Too many messages. Please wait a moment.", true);
      return;
    }

    addResponse(message.trim(), false, true);
    setMessage("");
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch(`${API_BASE_URL}/bedrock/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message.trim(),
          modelId: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const responseMessages = (data.response || "")
        .split(",")
        .map((msg) => msg.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);

      responseMessages.forEach((msg) => addResponse(msg));
    } catch (error) {
      console.error("Message send error:", error);
      addResponse(`Error sending message: ${error.message}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recognition start
  const handleVoiceStart = async () => {
    if (!deviceAvailable) {
      const hasDevice = await checkAudioDevices();
      if (!hasDevice) return;
    }

    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Voice recognition start error:', error);
        addResponse("Error starting voice recognition. Please try again.", true);
      }
    } else {
      addResponse("Your browser does not support voice recognition.", true);
    }
  };

  // Voice recognition end
  const handleVoiceEnd = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  // Get microphone button title
  const getMicrophoneButtonTitle = () => {
    if (!deviceAvailable) return "No microphone detected";
    if (!hasPermission) return "Click to allow microphone";
    return "Hold to speak";
  };

  // Handle textarea key down
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no user, show sign-in
  if (!user) {
    return (
      <div className="auth-required">
        <p>Please sign in with Google to access the chat.</p>
        <button 
          onClick={handleGoogleSignIn} 
          aria-label="Sign in with Google"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="Chat">
      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      <div className="responses-view">
        <div className="message-container">
          {responses.map((res, index) => (
            <div
              key={index}
              className={`message-item ${
                res.isUser
                  ? "user-message"
                  : res.isError
                  ? "error-message"
                  : "server-message"
              }`}
            >
              {res.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="form-chat">
        <textarea
          className="input-send"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
        />
        <button
          className="button-send btn-send"
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          aria-label="Send message"
        >
          <i
            className="fa-solid fa-paper-plane fa-2xl"
            style={{ color: "#ffffff" }}
          ></i>
        </button>
        <button
          className={`voice-button btn-send ${isRecording ? 'recording' : ''}`}
          title={getMicrophoneButtonTitle()}
          onTouchStart={handleVoiceStart}
          onMouseDown={handleVoiceStart}
          onTouchEnd={handleVoiceEnd}
          onMouseUp={handleVoiceEnd}
          disabled={isLoading}
          aria-label="Voice input"
        >
          <i
            className="fa-solid fa-microphone fa-2xl"
            style={{ color: "#ffffff" }}
          ></i>
        </button>
      </div>
    </div>
  );
}

export default Chat;