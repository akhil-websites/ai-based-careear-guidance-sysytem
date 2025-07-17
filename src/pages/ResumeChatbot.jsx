import React, { useState } from "react";
import "./resumeChatbot.css";

const ResumeChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about your resume!" }
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newMessages = [...messages, { sender: "user", text: inputText }];
    setMessages(newMessages);
    setInputText("");
    
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText })
      });
      const data = await response.json();
      setMessages([...newMessages, { sender: "bot", text: data.response || "Error getting response." }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { sender: "bot", text: "Error communicating with the server." }]);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Ask for resume tips..." 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ResumeChatbot;
