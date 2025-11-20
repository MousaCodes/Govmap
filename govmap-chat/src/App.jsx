// src/App.jsx
import React from "react";
import "./App.css";
import GovMapPane from "./components/GovMapPane";
import ChatPane from "./components/ChatPane";

function App() {
  return (
    <div className="app-root">
      <div className="left-pane">
        <GovMapPane />
      </div>
      <div className="right-pane">
        <ChatPane />
      </div>
    </div>
  );
}

export default App;
