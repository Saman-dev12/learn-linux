import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onCommand: (command: string) => Promise<string>;
  onOutput: (output: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, onOutput }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [cols, setCols] = useState(75);
  const isRendered = useRef(false);

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
        },
      });

      xtermRef.current.open(terminalRef.current);

      xtermRef.current.write('Welcome to the Linux Terminal!\r\n> ');

      xtermRef.current.onKey(async ({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
        const xterm = xtermRef.current;
        if (!xterm) return;

        if (domEvent.key === 'Enter') {
          const input = xterm.buffer.active.getLine(xterm.buffer.active.cursorY)?.translateToString(false).trim();
          if (input) {
            const command = input.replace(/^>\s*/, '');
            if (typeof onCommand === 'function') {
              try {
                const output = await onCommand(command);
                onOutput(output);
                
                xterm.write(`\r\n${output}\r\n> `); // This line shows the output on the terminal
              } catch (error:any) {
                console.error('Error executing command:', error);
                xterm.write(`\r\nError: ${error.message}\r\n> `);
              }
            }
          }
        } else if (domEvent.key === 'Backspace') {
          if (xterm.buffer.active.cursorX > 2) {
            xterm.write('\b \b');
          }
        } else if (!domEvent.ctrlKey && !domEvent.altKey && !domEvent.metaKey) {
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
  }, [cols, onCommand, onOutput]);

  return <div ref={terminalRef} className="h-[80%] w-full" />;
};

export default Terminal;
