import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Si usas react-router
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Chat.css";
import sendIcon from "../../../../assets/img/icons/send.png";
import ModelSelector from "../ModelSelector/ModelSelector";

function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(
    "amazon.titan-text-express-v1"
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login"); // Redirige a la página de inicio de sesión si no hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google Sign-In", error);
    }
  };

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
      const response = await fetch("http://localhost:1234/bedrock/invoke", {
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

  if (!user) {
    return (
      <div className="auth-required">
        <p>Please sign in with Google to access the chat.</p>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
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
        <button className="voice-button btn-send">
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

