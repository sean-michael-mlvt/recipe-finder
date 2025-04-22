"use client";
import Link from "next/link";
import { doCredentialLogin } from "../app/actions";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const response = await doCredentialLogin(formData);

      if (response?.error) {
        console.error(response.error);
        setError(response.error.message || "An error occurred");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      console.error(e);
      setError("Check your Credentials");
    }
  }

  return (
    <div className='ShowItemList'>
    <div className="grid mt-8 justify-items-center"> 
      <div className="shadow-lg p-5 rounded-lg border-t-4 bg-white border-black-700">
       <h1 className="text-xl text-slate-600 font-bold my-4">Login</h1>
      {error && <div className="text-lg text-red-500">{error}</div>}
      <form
  onSubmit={onSubmit}
  className="my-8 max-w-md mx-auto flex flex-col gap-4 border p-6 border-gray-300 rounded-md shadow-sm bg-white"
>
  <div className="flex flex-col">
    <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
      Email Address
    </label>
    <input
      className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="email"
      name="email"
      id="email"
      placeholder="Email"
      required
    />
  </div>

  <div className="flex flex-col">
    <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
      Password
    </label>
    <input
      className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="password"
      name="password"
      id="password"
      placeholder="Password"
      required
    />
  </div>

  <button
    type="submit"
    className="bg-lake-herrick text-white rounded px-4 py-2 mt-2 hover:bg-blue-800 transition"
  >
    Login
  </button>
</form>

      <p className="my-3 text-center">
        Don't you have an account?
        <Link href="signup" className="mx-2 underline">Signup</Link>
      </p>
    </div>
    </div>
    </div>
  );
};

export default LoginForm;
