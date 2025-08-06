'use client';

import Link from 'next/link';
import { Inter, Dancing_Script } from 'next/font/google';
import {
  FaStethoscope,
  FaUserInjured,
  FaPrescriptionBottleAlt,
} from 'react-icons/fa';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-dancing-script',
});

export default function Home() {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-end">
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-2 rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200 shadow-md"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 rounded-full text-teal-600 border border-teal-600 hover:bg-teal-50 transition-colors duration-200 shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col items-center justify-center text-white text-center p-6"
        style={{
          backgroundImage: `url('/images/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-indigo-900/60 z-0"></div>

        <div className="relative z-10 animate-fade-in">
          <h1
            className={`${dancingScript.className} text-6xl md:text-8xl font-bold leading-tight drop-shadow-lg`}
          >
            Simama
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium tracking-wide drop-shadow-md">
            Helping You Stand Strong Again
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-teal-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Recovery
              <ArrowRightIcon className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* What Simama Offers */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            How Simama Supports You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Doctors */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
              <div className="text-teal-600 mb-4">
                <FaStethoscope className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                For Doctors
              </h3>
              <p className="text-gray-600">
                Simplify care, manage patient records, and prescribe with
                confidence. Simama gives you tools that let you focus on what
                matters most — your patients.
              </p>
              <Link
                href="/doctor"
                className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn More <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Patients */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
              <div className="text-teal-600 mb-4">
                <FaUserInjured className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                For Patients
              </h3>
              <p className="text-gray-600">
                See your prescriptions, message your care team, and take control
                of your healing journey — all in one place.
              </p>
              <Link
                href="/patient"
                className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn More <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Pharmacists */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
              <div className="text-teal-600 mb-4">
                <FaPrescriptionBottleAlt className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                For Pharmacists
              </h3>
              <p className="text-gray-600">
                Fulfill prescriptions efficiently and connect with prescribers
                seamlessly. Simama supports your workflow with clarity and speed.
              </p>
              <Link
                href="/pharmacist"
                className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Learn More <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Simama. All rights reserved.</p>
      </footer>
    </div>
  );
}
