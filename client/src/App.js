import React, { useState, useEffect } from 'react';
import TerminalComponent from './components/Terminal';
import { darkTheme } from './theme';
import './App.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    // Check if we're joining an existing session
    const urlParams = new URLSearchParams(window.location.search);
    const existingSessionId = urlParams.get('session');
    
    if (existingSessionId) {
      setSessionId(existingSessionId);
      setIsHost(false);
    } else {
      // Create new session
      const newSessionId = Math.random().toString(36).substring(7);
      setSessionId(newSessionId);
      setIsHost(true);
      // Update URL with session ID
      window.history.replaceState({}, '', `?session=${newSessionId}`);
    }
  }, []);

  const copySessionLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show feedback
    const button = document.querySelector('.copy-button');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    // You can implement font size change logic here
  };

  return (
    <div className="App" style={{ backgroundColor: darkTheme.colors.background }}>
      <header className="App-header" style={{ backgroundColor: darkTheme.colors.surface }}>
        <div className="header-content">
          <h1 style={{ color: darkTheme.colors.text }}>SyncShell</h1>
          <div className="header-controls">
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
              style={{ 
                backgroundColor: darkTheme.colors.surface,
                color: darkTheme.colors.text,
                border: `1px solid ${darkTheme.colors.border}`
              }}
            >
              ⚙️
            </button>
          </div>
        </div>
        {sessionId && (
          <div className="session-info">
            <p style={{ color: darkTheme.colors.textSecondary }}>
              Session ID: {sessionId}
              {isHost && ' (Host)'}
            </p>
            <button 
              className="copy-button"
              onClick={copySessionLink}
              style={{ 
                backgroundColor: darkTheme.colors.primary,
                color: darkTheme.colors.text
              }}
            >
              Copy Session Link
            </button>
          </div>
        )}
        {showSettings && (
          <div className="settings-panel" style={{ backgroundColor: darkTheme.colors.surface }}>
            <h3 style={{ color: darkTheme.colors.text }}>Settings</h3>
            <div className="setting-item">
              <label style={{ color: darkTheme.colors.textSecondary }}>Font Size:</label>
              <input 
                type="range" 
                min="10" 
                max="24" 
                value={fontSize}
                onChange={handleFontSizeChange}
              />
              <span style={{ color: darkTheme.colors.textSecondary }}>{fontSize}px</span>
            </div>
          </div>
        )}
      </header>
      <main className="terminal-container">
        {sessionId && <TerminalComponent sessionId={sessionId} />}
      </main>
    </div>
  );
}

export default App; 