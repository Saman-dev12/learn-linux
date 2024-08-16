"use client"
import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import registerImg from '~/assets/register.jpg'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';


const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<any>(null);
  const router = useRouter()

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send registration request
      const response = await axios.post(`/api/users/signup`, { email, username, password,confirmPassword });
        // console.log(response.data);
      // Handle successful registration (e.g., redirect to login or show success message)
      if(response.data){
        router.push('/login');
      }
    } catch (err: unknown) { 
      // Handle error
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left Side */}
        <div className="relative">
          <Image
            src={registerImg}
            alt="Register"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
          {/* Text on image */}
          {/* <div
            className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block"
          >
            <span className="text-white text-xl">
              Create an account with us and start connecting with people who share your skills.
            </span>
          </div> */}
        </div>
        
        {/* Right Side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Create an account</span>
          <span className="font-light text-gray-400 mb-8">
            Join us! Please enter your details to create a new account.
          </span>
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <span className="mb-2 text-md">Username</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="py-4">
            <span className="mb-2 text-md">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
          >
            Sign Up
          </button>
          <div className="text-center text-gray-400">
            Already have an account?
            <Link href="/login" className="font-bold text-black cursor-pointer" onClick={() => router.push('/login')}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;