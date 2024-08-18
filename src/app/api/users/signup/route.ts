import dbConnect from "~/config/dbConnect";
import User from "~/models/User.model";
import { type NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


export async function POST(request: NextRequest){
    try {
        await dbConnect()
        const reqBody = await request.json()
        const {username, email, password,confirmPassword} = reqBody

        // console.log(reqBody);
        if(password != confirmPassword){
            return NextResponse.json({ error: "Password and confirm password should be same" }, { status: 400 })
        }
        //check if user already exists
        const user = await User.findOne({ email: email })

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        const returnedUser = savedUser.toObject()
        delete returnedUser.password
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: returnedUser
        })
        
        


    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}