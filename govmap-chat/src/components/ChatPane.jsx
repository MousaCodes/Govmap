// src/components/ChatPane.jsx
import React, { useState } from "react";

function ChatPane() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "assistant",
      text: "Hi Mousa 👋\nUpload a file or send a message to start."
    }
  ]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: trimmed
    };

    // Placeholder echo reply
    const reply = {
      id: Date.now() + 1,
      from: "assistant",
      text: "This is a placeholder reply. Later, connect me to your backend 🤖"
    };

    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const fileMsg = {
        id: Date.now(),
        from: "user",
        text:
          `Uploaded ${selectedFiles.length} file(s):\n` +
          selectedFiles.map((f) => `• ${f.name}`).join("\n")
      };
      setMessages((prev) => [...prev, fileMsg]);
    }
  };

  return (
    <div className="chat-pane">
      <div className="chat-header">
        <div>
          <h2>Chat Panel</h2>
          <p className="chat-subtitle">
            Semi-chat like ChatGPT, with file upload
          </p>
        </div>
      </div>

      <div className="chat-body">
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                "message-row " +
                (msg.from === "user" ? "message-user" : "message-assistant")
              }
            >
              <div className="message-bubble">
                <pre>{msg.text}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-footer">
        <div className="file-upload-row">
          <label className="file-upload-label">
            Upload files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          {files.length > 0 && (
            <div className="file-info">
              {files.length} file(s) selected
            </div>
          )}
        </div>

        <div className="input-row">
          <textarea
            className="chat-input"
            placeholder="Type your message… (Enter = send, Shift+Enter = new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPane;
