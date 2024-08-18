"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import Loading from '~/components/Loading';
import { env } from '~/env';

interface Chapter {
  chapterNumber: number;
  title: string;
}

interface Course {
  title: string;
  chapters: Chapter[];
}

interface User {
  completedChapters: number[];
}

interface CourseResponse {
  course: Course;
}

interface UserResponse {
  user: User;
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
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/course/${level}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data: CourseResponse = await response.json();
        setCourse(data.course);
      } catch (error) {
        setError('Failed to fetch course. Please try again later.');
      }
    };

    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/user?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data: UserResponse = await response.json();
          setUser(data.user);
        } catch (error) {
          setError('Failed to fetch user data. Please try again later.');
        }
      }
    };

    fetchCourse();
    fetchUser();
  }, [session, level]);

  if (!course || !user) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  const handleChapterClick = (chapterNumber: number) => {
    if (isChapterAccessible(chapterNumber)) {
      router.push(`/dashboard/${level}/${chapterNumber}?level=${level}`);
    }
  };

  const isChapterAccessible = (chapterNumber: number) => {
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
