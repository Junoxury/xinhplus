'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Xinh hơn mỗi ngày
          </h1>
          <p className="text-gray-600">Welcome back! Please login to your account.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>
          
          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-pink-50 border border-pink-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-pink-500">
                Forgot password ?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Login
            </button>
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

        <div className="text-center space-y-2">
          <p className="text-gray-600">Don't have an account?</p>
          <Link 
            href="/register/step1" 
            className="text-pink-500 font-semibold hover:text-pink-600 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
} 