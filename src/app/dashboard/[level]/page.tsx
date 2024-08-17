"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSession } from 'next-auth/react';

interface Course {
  title: string;
  chapters: {
    chapterNumber: number;
    title: string;
  }[];
}

interface User {
  completedChapters: number[];
}

function Page({ params }: { params: { level: string } }) {
  const router = useRouter();
  const level = params.level;
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        })
        .catch(error => setError('Failed to fetch user data. Please try again later.'));
    }
  }, [session, level]);

  if (!course || !user) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleChapterClick = (chapterNumber: number) => {
    if (isChapterAccessible(chapterNumber)) {
      router.push(`/dashboard/${level}/${chapterNumber}?level=${level}`);
    }
  };

  const isChapterAccessible = (chapterNumber: number) => {
    // Chapter 1 is always accessible
    // Any chapter is accessible if the previous chapter is completed
    return chapterNumber === 1 || user?.completedChapters.includes(chapterNumber - 1) || false;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <button
        onClick={() => router.push('/dashboard')}
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
          onClick={() => handleChapterClick(chapter.chapterNumber)}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <span className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
              {chapter.chapterNumber}. {chapter.title}
            </span>
            {user.completedChapters.includes(chapter.chapterNumber) && (
              <span className="text-green-500 text-xl sm:text-2xl">✓</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Page;
