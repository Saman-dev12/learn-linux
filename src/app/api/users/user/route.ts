import { NextResponse } from 'next/server';
import dbConnect from '~/config/dbConnect';
import User from '~/models/User.model';

async function getUserByEmail(email: string) {
  await dbConnect();
  const user = await User.findOne({ email }).select('-password -confirmPassword');
  return user;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
