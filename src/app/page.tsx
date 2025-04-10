import bgImage from '@/assets/ingredient-board-dark.jpg';

export default function Home() {
  return (
    <div className="homepage relative grid grid-rows-[auto_1fr] items-center justify-items-center p-8 gap-16 flex-grow font-[family-name:var(--font-geist-sans)]" style={{backgroundImage: `${bgImage}`}}>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Main Content */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center h-full relative z-10">
        <h1 className="text-5xl md:text-8xl text-white"> FIND RECIPES </h1>

        <h3 className="text-l md:text-3xl text-white"> THAT USE WHAT YOU ALREADY HAVE </h3>

        <button className="cursor-pointer flex items-center text-2xl text-white bg-lake-herrick text-oswald hover:text-white px-7 py-3">
          GET STARTED
        </button>

      </main>
    </div>
  );
}
