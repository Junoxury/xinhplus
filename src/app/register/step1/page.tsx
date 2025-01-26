'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function RegisterStep1() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Sign Up (1/3)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 pl-1">
                숫자, 영문자, 특수문자 포함 8 - 20자로 입력해주세요
              </p>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confrim Password"
                className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mt-8">
              <Link href="/register/step2">
                <button
                  type="button"
                  className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Next
                </button>
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="p-2 border rounded-full hover:border-pink-500 transition-colors">
                <Image
                  src="/images/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </button>
              <button className="p-2 border rounded-full hover:border-pink-500 transition-colors">
                <Image
                  src="/images/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 