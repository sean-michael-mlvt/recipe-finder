"use client";

import bgImage from '@/assets/ingredient-board-dark.jpg';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Function to be called when Back to Home button is clicked
  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="homepage relative grid grid-rows-[auto_1fr] items-center justify-items-center p-8 gap-16 flex-grow font-[family-name:var(--font-geist-sans)]" style={{backgroundImage: `${bgImage}`}}>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Main Content */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center h-full relative z-10">
        <h1 className="text-5xl md:text-8xl text-white"> PAGE NOT FOUND </h1>

        <button className="cursor-pointer flex items-center text-2xl text-white bg-lake-herrick text-oswald hover:text-white px-7 py-3" onClick={handleBackHome}>
          BACK TO HOME
        </button>

      </main>
    </div>
  );
}
