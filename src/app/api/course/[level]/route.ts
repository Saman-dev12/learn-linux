import { FilterQuery } from 'mongoose';
import { type NextRequest, NextResponse } from 'next/server';
import Course from '~/models/Course.model';

// Define types for the Course model, if needed
interface CommandType {
  command: string;
  description: string;
  syntax: string;
}

interface SectionType {
  section: string;
  details?: string[] | { [key: string]: string }[];
  commands?: CommandType[];
}

interface ChapterType {
  chapterNumber: number;
  title: string;
  objective: string;
  content: SectionType[];
}

interface CourseType {
  for: string;
  course: {
    title: string;
    chapters: ChapterType[];
    additionalResources: {
      glossary: string;
      references: string;
    };
  };
}

export async function GET(request: NextRequest, { params }: { params: { level: string } }) {
  try {
    const level: string = params.level; // Ensure level is typed as string

    // Adjust the type of the query to match the CourseType interface
    const course = await Course.findOne<CourseType>({ for: level } as FilterQuery<CourseType>);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error reading course data:', error);
    return NextResponse.json({ error: 'Failed to load course data' }, { status: 500 });
  }
}
