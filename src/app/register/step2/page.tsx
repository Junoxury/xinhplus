'use client'

import Link from 'next/link'

export default function RegisterStep2() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Sign Up (2/3)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <form className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="py-4 px-6 rounded-lg border-2 border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Male</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="py-4 px-6 rounded-lg border-2 border-pink-500 text-pink-500 hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Female</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div>
              <input
                type="tel"
                placeholder="Contact number"
                className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="pt-4">
              <Link href="/register/step3">
                <button
                  type="button"
                  className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Next
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 