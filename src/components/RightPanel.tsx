// RightPanel.tsx
"use client";

import React from 'react';
import Terminal from '~/components/Terminal'; // Ensure this component exists

interface RightPanelProps {
  handleCommand: (command: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ handleCommand }) => {
  return (
    <div className="flex-1 h-screen">
      <Terminal onCommand={handleCommand} />
    </div>
  );
};

export default RightPanel;
