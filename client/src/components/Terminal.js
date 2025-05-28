import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';
import { darkTheme } from '../theme';

const TerminalComponent = ({ sessionId }) => {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: darkTheme.terminal,
      scrollback: 10000,
      convertEol: true,
      cursorStyle: 'block'
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);

    // Mount terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:3001');
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      term.writeln('\x1b[32mConnected to server\x1b[0m');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      term.writeln('\x1b[31mDisconnected from server\x1b[0m');
    });

    // Join session
    socketRef.current.emit('join-session', sessionId);

    // Handle terminal input
    term.onData((data) => {
      // Handle special keys
      if (data === '\u0003') { // Ctrl+C
        socketRef.current.emit('terminal-input', {
          sessionId,
          input: '\x03'
        });
        return;
      }

      if (data === '\u000C') { // Ctrl+L
        term.clear();
        return;
      }

      // Handle up/down arrows for command history
      if (data === '\u001b[A') { // Up arrow
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(prev => prev + 1);
          term.write('\x1b[2K\r'); // Clear current line
          term.write(commandHistory[commandHistory.length - 1 - historyIndex]);
        }
        return;
      }

      if (data === '\u001b[B') { // Down arrow
        if (historyIndex > 0) {
          setHistoryIndex(prev => prev - 1);
          term.write('\x1b[2K\r'); // Clear current line
          term.write(commandHistory[commandHistory.length - 1 - historyIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          term.write('\x1b[2K\r'); // Clear current line
        }
        return;
      }

      // Handle Enter key
      if (data === '\r') {
        const currentLine = term.buffer.active.getLine(term.buffer.active.baseY + term.buffer.active.cursorY);
        const command = currentLine?.translateToString().trim() || '';
        
        if (command) {
          setCommandHistory(prev => [...prev, command]);
          setHistoryIndex(-1);
        }
      }

      socketRef.current.emit('terminal-input', {
        sessionId,
        input: data
      });
    });

    // Handle terminal output
    socketRef.current.on('terminal-output', (data) => {
      term.write(data);
    });

    socketRef.current.on('terminal-error', (data) => {
      term.write('\x1b[31m' + data + '\x1b[0m');
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      term.dispose();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [sessionId]);

  return (
    <div 
      ref={terminalRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: darkTheme.colors.background,
        padding: '10px',
        borderRadius: '4px',
        border: `1px solid ${darkTheme.colors.border}`
      }}
    />
  );
};

export default TerminalComponent; 