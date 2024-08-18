"use client";

import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';

interface Command {
  command: string;
  description: string;
  syntax: string;
}

interface Section {
  section: string;
  commands?: Command[];
}

interface Chapter {
  title: string;
  content: Section[];
}

interface LeftPanelProps {
  selectedChapter: Chapter | null;
  level: string | string[] | undefined;
  chapter: number;
  user: { completedChapters: number[] } | null;
  session: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  selectedChapter,
  level,
  chapter,
  user,
  session,
  setError,
  setUser,
}) => {
  const router = useRouter();

  if (!selectedChapter || !user) return <div>Loading...</div>;

  const handleBackClick = () => router.push(`/dashboard/${level}`);

  const handleMarkAsComplete = async () => {
    if (!selectedChapter || !user || !Array.isArray(user.completedChapters)) return;

    const updatedCompletedChapters = [...user.completedChapters, chapter];

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          completedChapters: updatedCompletedChapters,
        }),
      });

      if (response.ok) {
        setUser((prevUser: any) => ({
          ...prevUser!,
          completedChapters: updatedCompletedChapters,
        }));
        router.push(`/dashboard/${level}`);
      } else {
        setError('Failed to mark chapter as complete. Please try again later.');
      }
    } catch {
      setError('Failed to mark chapter as complete. Please try again later.');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"> {/* Added overflow-y-auto */}
      <button
        onClick={handleBackClick}
        className="mb-4 sm:mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 flex items-center"
      >
        <IoIosArrowRoundBack className="mr-2 text-xl sm:text-2xl" />
        <span className="text-sm sm:text-lg">cd ..</span>
      </button>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
        {selectedChapter.title}
      </h3>
      {selectedChapter.content.map((section, index) => (
        <div key={index} className="mb-6 sm:mb-8">
          <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 text-gray-700">
            {section.section}
          </h4>
          {section.commands && (
            <ul className="space-y-4 sm:space-y-6">
              {section.commands.map((cmd, cmdIndex) => (
                <li key={cmdIndex} className="bg-white shadow-md rounded-lg p-4">
                  <div className="text-lg font-medium text-gray-900">{cmd.command}</div>
                  <div className="text-sm text-gray-600">{cmd.description}</div>
                  <div className="text-sm text-gray-500 mt-2">Syntax: {cmd.syntax}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {!user.completedChapters.includes(chapter) && (
        <button
          onClick={handleMarkAsComplete}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
        >
          <span className="text-sm sm:text-lg">Mark as Complete</span>
        </button>
      )}
    </div>
  );
};

export default LeftPanel;
