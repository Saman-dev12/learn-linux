import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Welcome to the Linux Terminal!</h1>
        <p className="text-base sm:text-lg mb-8 text-center max-w-2xl">
          Welcome to your command line interface for learning Linux! Here, you can explore a variety of courses, tutorials, and resources designed for every skill level. 
          Whether you're a newbie or a seasoned pro, there's something here for you!
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-green-500 text-white rounded-full text-lg hover:bg-green-600 transition duration-200">
          Start Your Journey
        </Link>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold">Interactive Command Line Tutorials</h2>
            <p className="mt-2 text-sm sm:text-base">Learn Linux commands and concepts through engaging, hands-on exercises in a terminal-like environment.</p>
          </div>
          <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold">Community Terminal Support</h2>
            <p className="mt-2 text-sm sm:text-base">Join our vibrant community forums to ask questions and share insights with fellow learners.</p>
          </div>
          <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold">Linux Certification Programs</h2>
            <p className="mt-2 text-sm sm:text-base">Achieve certification and showcase your Linux skills to potential employers.</p>
          </div>
        </div>
      </div>
    </>
  );
}
