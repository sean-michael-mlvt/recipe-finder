"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Link from "next/link";

const SignupForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New: Loading state

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); // Show loading state while processing

    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get("username") as string | null;
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;

      if (!username || !email || !password) {
        throw new Error("All fields are required.");
      }

      console.log("Calling /api/signup POST with username and email:", username, email);

      const response = await fetch(`/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      let data;
      try {
        data = await response.json(); // Ensure JSON parsing succeeds
      } catch (error) {
        console.error("Error parsing API response:", error);
        data = { message: response.statusText }; // Fallback to status text
      }

      if (response.status === 201) {
        router.push("/login");
      } else if (response.status === 409) {
        setErrorMessage(data.message || "Email has already been registered.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup error:", error.message || "An error occurred during registration.");
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Remove loading state after request completes
    }
  }

  return (
    <>
      <div className="grid mt-8 justify-items-center">
        <div className="shadow-lg p-5 rounded-lg border-t-4 bg-white border-black">
          <h1 className="text-xl text-slate-600 my-4">SIGNUP</h1>

          <form
            onSubmit={handleSubmit}
            className="my-8 max-w-md mx-auto flex flex-col gap-4 border p-6 border-gray-300 rounded-md shadow-sm bg-white"
          >
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-700">Username</label>
              <input
                className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="username"
                id="username"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email Address</label>
              <input
                className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                id="email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                id="password"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-lake-herrick text-white rounded px-4 py-2 mt-2 hover:bg-red-800 transition"
              disabled={loading} // Prevent spam clicking
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="my-3 text-center">
            Already have an account?
            <Link href="/login" className="mx-2 underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Error Popup Modal */}
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-red-600">{errorMessage}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setErrorMessage(null)} className="bg-gray-300 px-4 py-2 rounded-md">
                Close
              </button>
              <button onClick={() => setErrorMessage(null)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupForm;
