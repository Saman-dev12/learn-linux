import { NextRequest, NextResponse } from 'next/server';
import  dbConnect  from '~/config/dbConnect';
import User from '~/models/User.model';

export async function POST(req: NextRequest) {
  try {
    const { email, completedChapters } = await req.json();

    if (!email || !Array.isArray(completedChapters)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { completedChapters } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
