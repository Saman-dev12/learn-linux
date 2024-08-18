import dbConnect from "~/config/dbConnect";
import User from "~/models/User.model";
import { type NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { username, email, password, confirmPassword } = reqBody;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const returnedUser = savedUser.toObject();
    delete returnedUser.password; // Remove password from response

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: returnedUser,
    });
  } catch (error: any) {
    console.error('Error during registration:', error); // Added console logging
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
