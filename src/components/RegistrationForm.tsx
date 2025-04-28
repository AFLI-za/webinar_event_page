'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';

// Define validation schema
const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [showPopup, setShowPopup] = useState(false);

  // Close popup when clicking escape key or outside the popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPopup(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('popup-overlay')) {
        setShowPopup(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setSubmitStatus({
        success: true,
        message: 'Thank you for registering. Please check your email for the details for the event.',
      });
      setShowPopup(true);
      reset();
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Banner Header */}
      <div className="rounded-lg overflow-hidden bg-white relative mb-10 shadow-lg border border-gray-100">
        {/* Brand color accent bar */}
        <div className="bg-[#971c61] h-3 w-full absolute top-0 left-0"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#971c61] opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#971c61] opacity-5 rounded-full transform -translate-x-28 translate-y-28"></div>

        {/* Content container */}
        <div className="p-4 sm:p-6 md:p-8 pt-8 sm:pt-10 md:pt-12 text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/AFLI LOGO.png"
              alt="AFLI Logo"
              width={180}
              height={60}
              className="mb-4"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-800">Reflections on the Africa Jobs Scenarios Report</h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[#971c61]">Register</h1>

          <div className="h-1 w-16 bg-[#971c61] mx-auto mb-6"></div>

          <div className="text-7xl font-bold tracking-tighter text-gray-800 opacity-90 mb-2">2025</div>
          <div className="text-xl font-medium text-[#971c61] mb-6">MAY 20</div>

          <div className="text-sm text-gray-500 mt-4">
            African Leadership Institute
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 mb-10 border border-gray-100 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#971c61] opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>

        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">Register for the Reflections on the Africa Jobs Scenarios Report</h2>

        {/* Success popup */}
        {showPopup && submitStatus.success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 popup-overlay">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden animate-fadeIn">
              {/* Brand color accent bar */}
              <div className="bg-[#971c61] h-2 w-full absolute top-0 left-0"></div>

              {/* Close button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Popup content */}
              <div className="p-4 sm:p-6 pt-6 sm:pt-8">
                {/* Success icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">{submitStatus.message}</p>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#971c61] opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>

                {/* Event details */}
                <div className="bg-[#f9f0f5] border-l-4 border-[#971c61] p-4 mb-6 relative">
                  <h4 className="font-semibold text-[#971c61] mb-2">REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT</h4>
                  <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Date:</span> May 20, 2025</p>
                  <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Time:</span> 3:00 PM WAT</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Duration:</span> 90 minutes</p>
                </div>

                {/* Calendar download button */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/api/calendar"
                    className="inline-flex items-center justify-center bg-[#971c61] hover:bg-[#7d1751] transition-colors text-white py-2 px-4 rounded font-medium text-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Calendar
                  </a>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800 py-2 px-4 rounded font-medium text-center"
                  >
                    Close
                  </button>
                </div>

                {/* Reminder info */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  You'll receive reminder emails one week, one day, and one hour before the event.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus.success === false && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#971c61] focus:border-transparent transition"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#971c61] focus:border-transparent transition"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#971c61] hover:bg-[#7d1751] transition-colors text-white py-3 px-6 rounded font-medium text-center disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#971c61] hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <Link
            className="text-sm hover:underline hover:text-[#971c61]"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm hover:underline hover:text-[#971c61]"
            href="/admin"
          >
            Admin
          </Link>
          <a
            className="text-sm hover:underline hover:text-[#971c61]"
            href="#"
          >
            Contact Us
          </a>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          © 2025 African Leadership Institute. All rights reserved.
        </div>
      </footer>
    </div>
  );
}