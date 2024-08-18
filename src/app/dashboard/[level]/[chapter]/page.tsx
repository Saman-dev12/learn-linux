"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LeftPanel from '~/components/LeftPanel';
import Terminal from '~/components/Terminal';
import Loading from '~/components/Loading';

interface Course {
  chapters: {
    chapterNumber: number;
    title: string;
    objective: string;
    content: any[];
  }[];
}

interface User {
  completedChapters: number[];
}

function Page({ params, searchParams }: { params: { chapter: number }, searchParams?: { [key: string]: string | string[] | undefined }; }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const chapter = Number(params.chapter);
  const level = searchParams?.level;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course/${level}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data.course);
        const chapterObj = data.course.chapters?.find(
          (chap: { chapterNumber: number; content: any[] }) => chap.chapterNumber === chapter
        );

        const content = chapterObj || null;
        setSelectedChapter(content);
        setIsLoading(false); // Stop loading when data is fetched
      } catch (error) {
        setError('Failed to fetch course. Please try again later.');
        setIsLoading(false); // Stop loading if there's an error
      }
    };

    fetchCourse();

    if (session?.user?.email) {
      fetch(`/api/users/user?email=${session.user.email}`)
        .then((response) => response.json())
        .then((data) => {
          const completedChapters = data.user.completedChapters || [];
          setUser({ ...data.user, completedChapters });
        })
        .catch(() => {
          setError('Failed to fetch user data. Please try again later.');
          setIsLoading(false); // Stop loading if there's an error
        });
    }
  }, [session, chapter]);

  if (isLoading) return <Loading />;

  if (error) return <div className="text-red-500">{error}</div>;

  const handleCommand = async (command: string) => {
    try {
      const response = await fetch('/api/execute-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();
      if (response.ok) {
        return result.output;
      } else {
        console.error(`Command error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 flex flex-col lg:flex-row h-screen">
      <div className="flex-1 overflow-y-auto">
        <LeftPanel
          selectedChapter={selectedChapter}
          level={level}
          chapter={chapter}
          user={user}
          session={session}
          setError={setError}
          setUser={setUser}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex-1 h-screen">
          <Terminal onCommand={handleCommand} onOutput={(output) => console.log(output)} />
        </div>
      </div>
    </div>
  );
}

export default Page;
