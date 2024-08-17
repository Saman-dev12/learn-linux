import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onCommand: (command: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onCommand }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [cols, setCols] = useState(75);

  const calculateCols = () => {
    if (terminalRef.current) {
      const width = terminalRef.current.offsetWidth;
      const fontWidth = 8.5; // approximate width of a character in 'Courier New' at font size 14
      const calculatedCols = Math.floor(width / fontWidth);
      setCols(calculatedCols);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      calculateCols();

      xtermRef.current = new XTerm({
        rows: 40,
        cols: cols,
        cursorBlink: true,
        fontFamily: 'Courier New, monospace',
        fontSize: 14,
        theme: {
          background: '#000000',
          foreground: '#D4D4D4',
          cursor: '#00FF00',
          black: '#000000',
          red: '#CD3131',
          green: '#0DBC79',
          yellow: '#E5E510',
          blue: '#2472C8',
          magenta: '#BC3FBC',
          cyan: '#11A8CD',
          white: '#E5E5E5',
          brightBlack: '#666666',
          brightRed: '#F14C4C',
          brightGreen: '#23D18B',
          brightYellow: '#F5F543',
          brightBlue: '#3B8EEA',
          brightMagenta: '#D670D6',
          brightCyan: '#29B8DB',
          brightWhite: '#E5E5E5',
        },
      });

      xtermRef.current.open(terminalRef.current);

      xtermRef.current.write('Welcome to the Linux Terminal!\r\n> '); // Changed prompt to '>'

      xtermRef.current.onKey(({ key, domEvent }) => {
        const xterm = xtermRef.current;
        if (!xterm) return;

        if (domEvent.key === 'Enter') {
          const line = xterm.buffer.active.getLine(xterm.buffer.active.cursorY);
          if (line) {
            const input = line.translateToString(false).trim(); // Get the input from the terminal
            if (input) {
              xterm.write('\r\n'); // Move to a new line
              const command = input.replace(/^>\s*/, ''); // Remove prompt characters (if any)
              onCommand(command); // Pass the command to the parent component
              xterm.write('\r\n> '); // Display the prompt after processing the command
            }
          }
        } else if (domEvent.key === 'Backspace') {
          // Do not delete the prompt
          if (xterm.buffer.active.cursorX > 2) {
            xterm.write('\b \b');
          }
        } else {
          xterm.write(key);
        }
      });
    }

    const handleResize = () => {
      calculateCols();
      if (xtermRef.current) {
        xtermRef.current.resize(cols, 40);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xtermRef.current?.dispose();
    };
  }, [cols, onCommand]);

  return <div ref={terminalRef} className="h-[80%] w-full" />;
};

export default Terminal;
