"use client"
import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import img from '~/assets/image.jpg';
import googleImg from '~/assets/google.svg';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                {/* Left Side */}
                <div className="flex flex-col justify-center p-8 md:p-14">
                    <span className="mb-3 text-4xl font-bold">Welcome back</span>
                    <span className="font-light text-gray-400 mb-8">
                        Welcome back! Please enter your details
                    </span>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="py-4">
                            <span className="mb-2 text-md">Email</span>
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="py-4">
                            <span className="mb-2 text-md">Password</span>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <span className="font-bold text-md cursor-pointer">Forgot password?</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Sign in
                        </button>
                    </form>
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
                    >
                        <Image src={googleImg} alt="Google" className="w-6 h-6 inline mr-2" />
                        Sign in with Google
                    </button>
                    <div className="text-center text-gray-400">
                        Don't have an account?
                        <Link href="/register" className="font-bold text-black cursor-pointer">Sign up for free</Link>
                    </div>
                </div>
                {/* Right Side */}
                <div className="relative">
                    <Image
                        src={img}
                        alt="Login"
                        className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
