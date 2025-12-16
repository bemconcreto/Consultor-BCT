"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/painel" })}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
    >
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.69 1.22 9.18 3.22l6.82-6.82C35.9 2.36 30.32 0 24 0 14.64 0 6.56 5.38 2.69 13.22l7.95 6.18C12.5 13.04 17.77 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.95-2.2 5.44-4.7 7.12l7.26 5.64C43.68 36.68 46.5 30.84 46.5 24z"
        />
        <path
          fill="#FBBC05"
          d="M10.64 28.6c-.45-1.35-.71-2.78-.71-4.3s.26-2.95.71-4.3l-7.95-6.18C.99 16.98 0 20.37 0 24s.99 7.02 2.69 10.18l7.95-6.18z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.32 0 11.9-2.08 15.87-5.64l-7.26-5.64c-2.02 1.36-4.6 2.18-8.61 2.18-6.23 0-11.5-3.54-13.36-8.9l-7.95 6.18C6.56 42.62 14.64 48 24 48z"
        />
      </svg>
      Entrar com Google
    </button>
  );
}