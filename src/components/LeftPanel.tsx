import { useRouter } from 'next/navigation'; // Import useRouter
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';

interface Course {
  title: string;
  chapters: {
    chapterNumber: number;
    title: string;
    content: {
      section: string;
      commands?: {
        command: string;
        description: string;
        syntax: string;
      }[];
    }[];
  }[];
}

interface User {
  completedChapters: number[];
}

function LeftPanel({ level }: { level: string }) {
  const router = useRouter(); // Initialize useRouter
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null); // State to hold error message
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course/${level}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data.course);
      } catch (error) {
        setError('Failed to fetch course. Please try again later.');
      }
    };

    fetchCourse();

    if (session?.user?.email) {
      fetch(`/api/users/user?email=${session.user.email}`)
        .then(response => response.json())
        .then(data => {
          const completedChapters = data.user.completedChapters || [];
          setUser({ ...data.user, completedChapters });

          // Automatically select the last completed chapter or the next one
          const lastCompletedChapter = Math.max(...completedChapters, 0);
          setSelectedChapter(null);
        })
        .catch(error => setError('Failed to fetch user data. Please try again later.'));
    }
  }, [session, level]);

  if (!course || !user) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>; // Display error message if there's an error

  const handleBackClick = () => {
    setSelectedChapter(null);
  };

  const handleMarkAsComplete = async () => {
    if (selectedChapter === null || !user || !Array.isArray(user.completedChapters)) return;

    const updatedCompletedChapters = [...user.completedChapters, selectedChapter];

    const response = await fetch('/api/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session?.user?.email,
        completedChapters: updatedCompletedChapters,
      }),
    });

    if (response.ok) {
      setUser(prevUser => ({
        ...prevUser!,
        completedChapters: updatedCompletedChapters,
      }));
      setSelectedChapter(null); // Move to the next chapter
    } else {
      setError('Failed to mark chapter as complete. Please try again later.');
    }
  };

  const isChapterAccessible = (chapterNumber: number) => {
    return chapterNumber === 1 || user?.completedChapters?.includes(chapterNumber - 1) || false;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {selectedChapter === null ? (
        <>
          <button
            onClick={() => router.push('/dashboard')} // Navigate to /dashboard
            className="mb-4 sm:mb-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <IoIosArrowRoundBack className="mr-2 text-xl sm:text-2xl" />
            <span className="text-sm sm:text-lg">Back to Dashboard</span>
          </button>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6 text-gray-800">{course.title}</h2>
          {course.chapters.map((chapter) => (
            <div
              key={chapter.chapterNumber}
              className={`p-4 mb-2 rounded-lg transition-all duration-300 ${
                isChapterAccessible(chapter.chapterNumber)
                  ? 'bg-white shadow-md hover:shadow-lg cursor-pointer hover:bg-gray-50'
                  : 'bg-gray-200 cursor-not-allowed opacity-50'
              }`}
              onClick={() => isChapterAccessible(chapter.chapterNumber) && setSelectedChapter(chapter.chapterNumber)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                <span className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                  {chapter.chapterNumber}. {chapter.title}
                </span>
                {user?.completedChapters?.includes(chapter.chapterNumber) && (
                  <span className="text-green-500 text-xl sm:text-2xl">✓</span>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <button
            onClick={handleBackClick}
            className="mb-4 sm:mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 flex items-center"
          >
            <IoIosArrowRoundBack className="mr-2 text-xl sm:text-2xl" />
            <span className="text-sm sm:text-lg">Back to Chapters</span>
          </button>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
            {course.chapters[selectedChapter - 1]?.title}
          </h3>
          {course.chapters[selectedChapter - 1]?.content.map((section, index) => (
            <div key={index} className="mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 text-gray-700">{section.section}</h4>
              {section.commands && (
                <ul className="space-y-4 sm:space-y-6">
                  {section.commands.map((cmd, cmdIndex) => (
                    <li key={cmdIndex} className="bg-white shadow-md rounded-lg p-4 sm:p-6 transition-transform transform hover:-translate-y-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                        <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md mr-2 font-mono">{cmd.command}</code>
                        <span className="text-gray-800">{cmd.description}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Syntax: <code className="bg-gray-100 px-2 py-1 rounded-md">{cmd.syntax}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {user && selectedChapter !== null && !user.completedChapters?.includes(selectedChapter) && (
            <button
              onClick={handleMarkAsComplete}
              className="mt-4 sm:mt-6 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
            >
              Mark as Complete
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default LeftPanel;
