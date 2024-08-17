'use client';
import LeftPanel from '~/components/LeftPanel';
import Terminal from '~/components/Terminal';

export default function Dashboard({ params }: { params: { level: string } }) {
  const level = params.level;

  const handleCommand = (command: string) => {
    console.log(`Command received: ${command}`);
    // You can add more logic here to process the command
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left side - Chapters or Commands */}
      <div className="w-full h-full lg:w-1/2 bg-gray-100 p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200">
        <LeftPanel level={level} />
      </div>

      {/* Right side - Terminal */}
      <div className="w-full h-full lg:w-1/2 bg-black p-4 md:p-6 flex items-center justify-center overflow-hidden">
  <div className="w-full h-full flex items-center justify-center">
    <Terminal onCommand={handleCommand} />
  </div>
</div>

    </div>
  );
}
