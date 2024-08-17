import { NextRequest, NextResponse } from 'next/server';
import Course from '~/models/Course.model';

export async function GET(request: NextRequest, { params }: { params: { level: string } }) {
  try {
    const level = params.level; 

    const course = await Course.findOne({ for: level });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error reading course data:', error);
    return NextResponse.json({ error: 'Failed to load course data' }, { status: 500 });
  }
}
