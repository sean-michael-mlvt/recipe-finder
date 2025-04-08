import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1
          style={{
            fontWeight: 'bold',
            color: '#000000',
            fontFamily: 'Oswald, sans-serif',
            fontSize: '48px',
          }}
        >
          Recipe Finder
        </h1>
        <Image
          className="dark:invert"
          src="https://plus.unsplash.com/premium_photo-1663050996179-86096a38569e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </main>
    </div>
  );
}
