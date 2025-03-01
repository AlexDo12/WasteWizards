// src/app/page.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import logo from "@/assets/logo.png";
import { useEffect, useState } from 'react';

// You can reuse the same Poppins font from the Navbar
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
});

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure animation plays smoothly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  return (
    <main className={`min-h-screen bg-white flex flex-col justify-between transition-opacity duration-1000 relative overflow-hidden ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Sparkles */}
      <div className="absolute top-20 left-10 w-9 h-9 text-green-400 opacity-60" style={{ animation: 'twinkle 4s infinite ease-in-out' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5 8.5l1.5 1.5-1.5 1.5L8 10l1.5-1.5zM12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>
      <div className="absolute top-40 left-6 w-6 h-6 text-blue-400 opacity-50" style={{ animation: 'twinkle 3s infinite ease-in-out 1s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>
      <div className="absolute top-60 left-16 w-5 h-5 text-green-500 opacity-40" style={{ animation: 'twinkle 5s infinite ease-in-out 0.5s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>
      <div className="absolute top-20 right-10 w-7 h-7 text-blue-400 opacity-50" style={{ animation: 'twinkle 4s infinite ease-in-out 1.5s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>
      <div className="absolute top-48 right-16 w-8 h-8 text-green-400 opacity-45" style={{ animation: 'twinkle 6s infinite ease-in-out 0.7s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>
      <div className="absolute top-72 right-8 w-5 h-5 text-blue-500 opacity-40" style={{ animation: 'twinkle 3.5s infinite ease-in-out 2s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1l2.5 5.5L20 9l-5.5 2.5L12 17l-2.5-5.5L4 9l5.5-2.5L12 1z" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="pt-8 px-4 text-center">
        <div className={`flex flex-col items-center justify-center mb-4 group transform transition-all duration-700 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
          <Image
            src={logo}
            alt="Waste Wizard Logo"
            width={150}
            height={150}
            className="h-36 w-auto object-contain mb-2 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
          />
          <h1 className={`text-7xl text-blue-900 ${poppins.className} relative transition-all duration-300 group-hover:text-green-400`}>
            Waste Wizard
            <span className="absolute -bottom-2 left-0 w-0 h-1 bg-green-400 transition-all duration-500 group-hover:w-full"></span>
          </h1>
        </div>
        <p className={`text-lg font-light text-blue-800 max-w-3xl mx-auto mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-semibold">Smart AI sorting that knows where your waste belongs.</span> <br></br>
          With three customizable bins, Waste Wizard automatically separates trash, recycling, and compost, saving time while helping the planet.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 py-4 pb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Capacity Card */}
          <Link
            href="/capacity"
            className={`bg-green-50 rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px] group ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl text-blue-900 text-center mb-4 ${poppins.className} group-hover:text-green-400 transition-colors duration-300`}>
              Capacity Monitoring
            </h2>
            <p className="text-blue-800 text-center">
              Track bin fill levels in real-time, locate your Waste Wizard unit, and receive alerts when any of the three bins need emptying.
            </p>
          </Link>

          {/* Statistics Card */}
          <Link
            href="/statistics"
            className={`bg-green-50 rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px] group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl text-blue-900 text-center mb-4 ${poppins.className} group-hover:text-green-400 transition-colors duration-300`}>
              Usage Statistics
            </h2>
            <p className="text-blue-800 text-center">
              Analyze waste patterns, identify trends, and generate comprehensive reports to improve efficiency.
            </p>
          </Link>

          {/* Configure Card */}
          <Link
            href="/configure"
            className={`bg-green-50 rounded-xl shadow-lg p-8 transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px] group ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-5 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h2 className={`text-2xl text-blue-900 text-center mb-4 ${poppins.className} group-hover:text-green-400 transition-colors duration-300`}>
              System Configuration
            </h2>
            <p className="text-blue-800 text-center">
              Customize your three internal bins for different waste types including trash, compost, plastic, metal, glass, and paper to match your needs.
            </p>
          </Link>
        </div>
      </section>

      {/* Add CSS for twinkle animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
      `}</style>
    </main>
  );
}