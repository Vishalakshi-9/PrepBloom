'use client'

import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="min-h-screen flex items-stretch text-[var(--foreground)] font-sans bg-[var(--background)]">
      {/* Left Image Section with soft pink overlay */}
      <div
        className="lg:flex w-1/2 hidden bg-pink-100 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1559070118-9f94d8f9c10e?auto=format&fit=crop&w=800&q=80)',
        }}
      >
        <div className="absolute bg-pink-200/70 inset-0 z-0 backdrop-blur-sm rounded-r-[3rem]"></div>
        <div className="w-full px-20 z-10">
          <h1 className="text-5xl font-extrabold text-pink-900 leading-tight mb-4">
            Join PrepBloom Today!
          </h1>
          <p className="text-xl text-pink-800 font-medium">
            Start your journey to confident interviews 💼🌸
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-4 z-0 bg-yellow-50"
      >
        <div className="w-full py-10 z-20">
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" alt="PrepBloom Logo" className="w-24 h-24" />
          </div>
          <h2 className="text-3xl font-bold text-pink-700 mb-2">Sign up to start practicing with AI</h2>
          {/* <p className="text-md text-pink-600 mb-6">Sign up to start practicing with AI</p> */}

          <div className="max-w-sm mx-auto">
            <SignUp
              appearance={{
                elements: {
                  card: {
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  },
                  headerTitle: {
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#d63384',
                  },
                  formButtonPrimary: {
                    backgroundColor: '#fbb6ce',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    ':hover': {
                      backgroundColor: '#f797b9',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
