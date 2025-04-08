import Image from "next/image";

export default function Home() {
  return (
    <div className="homepage grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Top Bar Section - Ensure header is at the top */}
      <header className="topBar w-full flex justify-between items-center bg-white p-4 absolute top-0 left-0">
        {/* Title */}
        <h1
          style={{
            fontWeight: 'bold',
            color: "black",
            fontFamily: 'Oswald, sans-serif',
            fontSize: '48px',
          }}
        >
          RECIPE FINDER
        </h1>

        {/* Navbar */}
        <nav className="navbar flex gap-4">
        <button className="login">LOGIN</button>
        <button className="signup">SIGNUP</button>
        </nav>
      </header>

      <main className="homepage flex flex-col gap-[32px] row-start-2 items-center sm:items-start justify-center h-full relative z-10">
      <h1
          style={{
            fontWeight: 'bold',
            color: "white",
            fontFamily: 'Oswald, sans-serif',
            fontSize: '48px',
          }}
        >
          FIND RECIPES
        </h1>

        <h3
          style={{
            fontWeight: 'bold',
            color: "white",
            fontFamily: 'Oswald, sans-serif',
            fontSize: '24px',
          }}
        >
          THAT USE WHAT YOU ALREADY HAVE
        </h3>

        <button className="get-started">
          GET STARTED
        </button>

      </main>
    </div>
  );
}
