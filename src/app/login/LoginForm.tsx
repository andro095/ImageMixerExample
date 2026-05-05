'use client'

import { useState } from 'react'
import { login, signup } from './actions'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <form className="flex flex-col gap-6 w-full">
      {isSignUp && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required={isSignUp}
            className="p-3 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="p-3 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-widest" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="p-3 bg-transparent border border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {isSignUp ? (
          <button
            formAction={signup}
            className="w-full p-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Sign Up
          </button>
        ) : (
          <button
            formAction={login}
            className="w-full p-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Log In
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full p-4 bg-transparent text-black border border-black font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors"
        >
          {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
        </button>
      </div>
    </form>
  )
}
