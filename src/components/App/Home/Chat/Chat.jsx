import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import ModelSelector from "../ModelSelector/ModelSelector";

function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("amazon.titan-text-express-v1");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [deviceAvailable, setDeviceAvailable] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [responses]);

  const checkAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioDevice = devices.some(device => device.kind === 'audioinput');
      
      setDeviceAvailable(hasAudioDevice);
      
      if (!hasAudioDevice) {
        addResponse("No se detectó ningún micrófono en tu dispositivo. Por favor, conecta un micrófono y recarga la página.", true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error al verificar dispositivos de audio:', error);
      addResponse("No se pudo verificar la disponibilidad del micrófono.", true);
      return false;
    }
  };

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
      console.error('Error al solicitar permiso del micrófono:', error);
      
      if (error.name === 'NotFoundError') {
        addResponse("No se encontró ningún micrófono. Por favor, verifica que tu micrófono esté conectado correctamente.", true);
        setDeviceAvailable(false);
      } else if (error.name === 'NotAllowedError') {
        addResponse("Permiso para usar el micrófono denegado. Por favor, permite el acceso al micrófono en la configuración de tu navegador.", true);
      } else if (error.name === 'NotReadableError') {
        addResponse("El micrófono está en uso por otra aplicación. Por favor, cierra otras aplicaciones que puedan estar usando el micrófono.", true);
      } else {
        addResponse("Hubo un error al acceder al micrófono. " + error.message, true);
      }
      
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    checkAudioDevices();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'not-allowed') {
          setHasPermission(false);
          addResponse("No se ha concedido permiso para usar el micrófono.", true);
        } else if (event.error === 'audio-capture') {
          setDeviceAvailable(false);
          addResponse("No se detectó ningún micrófono. Por favor, verifica tu hardware.", true);
        }
        setIsRecording(false);
      };

      navigator.mediaDevices?.addEventListener('devicechange', checkAudioDevices);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      navigator.mediaDevices?.removeEventListener('devicechange', checkAudioDevices);
    };
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("http://localhost:1234/bedrock/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const { models } = await response.json();
        setModels(models || []);
      } catch {
        addResponse("Error loading models. Please refresh the page.", true);
      }
    };
    fetchModels();
  }, []);

  const addResponse = (text, isError = false, isUser = false) => {
    setResponses((prev) => [...prev, { message: text, isError, isUser }]);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    addResponse(message.trim(), false, true);
    setMessage("");
    setIsLoading(true);

    try {
      // const response = await fetch("http://localhost:1234/bedrock/invoke", {
        const response = await fetch("https://54.234.225.:1234/bedrock/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message.trim(),
          modelId: selectedModel,
        }),
      });
      const data = await response.json();

      const responseMessages = (data.response || "")
        .split(",")
        .map((msg) => msg.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);

      responseMessages.forEach((msg) => addResponse(msg));
    } catch {
      addResponse("Error sending message. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
        console.error('Error al iniciar el reconocimiento de voz:', error);
        addResponse("Error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.", true);
      }
    } else {
      addResponse("Tu navegador no soporta reconocimiento de voz.", true);
    }
  };

  const handleVoiceEnd = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  const getMicrophoneButtonTitle = () => {
    if (!deviceAvailable) return "No se detectó micrófono";
    if (!hasPermission) return "Click para permitir el micrófono";
    return "Mantén presionado para hablar";
  };

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
        />
        <button
          className="button-send btn-send"
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          <i
            className="fa-solid fa-paper-plane fa-2xl"
            style={{ color: "#ffffff" }}
          ></i>
        </button>
        <button
          className={`voice-button btn-send ${isRecording ? 'recording' : ''}`}
          onMouseDown={handleVoiceStart}
          onMouseUp={handleVoiceEnd}
          onMouseLeave={handleVoiceEnd}
          disabled={!deviceAvailable}
          title={getMicrophoneButtonTitle()}
        >
          <i
            className="fa-solid fa-microphone fa-2xl"
            style={{ 
              color: isRecording ? "#ff0000" : deviceAvailable ? "#ffffff" : "#666666" 
            }}
          ></i>
        </button>
      </div>
    </div>
  );
}

export default Chat;