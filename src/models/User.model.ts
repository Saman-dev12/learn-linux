import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    completedChapters: number[];
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    confirmPassword: {
        type: String,
        required: false,
    },
    completedChapters: {
        type: [Number],
        default: [],
    }
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;