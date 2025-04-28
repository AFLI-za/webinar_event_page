'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [eventStatus, setEventStatus] = useState("UPCOMING");
  const [statusMessage, setStatusMessage] = useState("Join us for this exciting event!");
  const [buttonText, setButtonText] = useState("Register Now");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Event details
  const eventDate = new Date("2025-05-20T14:00:00Z"); // May 20th, 2025 at 3pm WAT (West African Time is GMT+1)
  const eventEndDate = new Date(eventDate.getTime() + 90 * 60 * 1000); // 90 minutes duration

  useEffect(() => {
    // Function to update event status
    const updateEventStatus = () => {
      const now = new Date();

      if (now < eventDate) {
        // Event hasn't started yet
        setEventStatus("UPCOMING");
        setStatusMessage("Join us for this exciting event!");
        setButtonText("Register Now");
        setButtonDisabled(false);
      } else if (now >= eventDate && now < eventEndDate) {
        // Event is ongoing
        setEventStatus("ONGOING");
        setStatusMessage("The event is happening now!");
        setButtonText("Join Event");
        setButtonDisabled(false);
      } else {
        // Event has ended
        setEventStatus("ENDED");
        setStatusMessage("The live event is over.");
        setButtonText("The event is over");
        setButtonDisabled(true);
      }
    };

    // Update status immediately
    updateEventStatus();

    // Set up interval to check status every minute
    const intervalId = setInterval(updateEventStatus, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [eventDate, eventEndDate]);

  // Format dates for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (): string => {
    // Always display time as 3:00 PM WAT regardless of user's timezone
    return "3:00 PM WAT";
  };

  // Function to determine if we should show registration form
  const shouldShowRegistration = () => {
    if (eventStatus === "ENDED") {
      return true; // Show post-event registration for updates
    }
    return false; // For upcoming/ongoing events, use the main banner button
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Modern Banner Design with White Background */}
      <div className="rounded-lg overflow-hidden bg-white relative mb-10 shadow-lg border border-gray-100">
        {/* Brand color accent bar */}
        <div className="bg-[#971c61] h-3 w-full absolute top-0 left-0"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#971c61] opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#971c61] opacity-5 rounded-full transform -translate-x-28 translate-y-28"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-[#971c61] opacity-5 rounded-full"></div>

        {/* Content container */}
        <div className="p-4 sm:p-6 md:p-8 pt-6 sm:pt-8 md:pt-10 relative z-10">
          {/* Top section with logo and status */}
          <div className="flex justify-between items-start mb-6">
            <Image
              src="/AFLI LOGO.png"
              alt="AFLI Logo"
              width={160}
              height={50}
              className="mb-4"
            />
            <div className={`py-1 px-3 rounded text-sm font-bold ${
              eventStatus === "UPCOMING" ? "bg-yellow-500 text-black" :
              eventStatus === "ONGOING" ? "bg-green-500 text-black" :
              "bg-gray-500 text-white"
            }`}>
              {eventStatus}
            </div>
          </div>

          {/* Main banner content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Event title */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-800">DIALOGUE FOR ACTION:</h1>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#971c61]">REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT</h1>

              <div className="h-1 w-16 bg-[#971c61] mb-6"></div>

              <div className="text-gray-600 mb-6">
                {statusMessage}
              </div>

              {buttonDisabled ? (
                <div className="bg-gray-300 text-gray-600 py-3 px-6 rounded font-medium text-center opacity-70">
                  {buttonText}
                </div>
              ) : (
                <Link href="/register" className="bg-[#971c61] hover:bg-[#7d1751] transition-colors text-white py-3 px-6 rounded font-medium inline-block">
                  {buttonText}
                </Link>
              )}
            </div>

            {/* Right side - Year and details */}
            <div className="flex-1 border-l-0 md:border-l border-gray-200 md:pl-8">
              <div className="text-7xl font-bold tracking-tighter text-gray-800 opacity-90 mb-2">2025</div>
              <div className="text-xl font-medium text-[#971c61] mb-6">MAY 20</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="border border-gray-200 rounded p-3 shadow-sm">
                  <div className="text-gray-500 mb-1">DATE</div>
                  <div className="font-medium text-gray-800">{formatDate(eventDate)}</div>
                </div>
                <div className="border border-gray-200 rounded p-3 shadow-sm">
                  <div className="text-gray-500 mb-1">TIME</div>
                  <div className="font-medium text-gray-800">{formatTime()}</div>
                </div>
                <div className="border border-gray-200 rounded p-3 shadow-sm">
                  <div className="text-gray-500 mb-1">DURATION</div>
                  <div className="font-medium text-gray-800">90 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent with institution name */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
            African Leadership Institute
          </div>
        </div>
      </div>

      {/* Registration Form Container - Only shown for ended events */}
      {shouldShowRegistration() && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Register for Updates</h2>
          <p className="text-center mb-6 text-gray-600">
            While this event has ended, you can still register to receive updates about future events and access to exclusive content.
          </p>

          <Link
            href="/register"
            className="bg-[#971c61] hover:bg-[#7d1751] transition-colors text-white py-3 px-6 rounded font-medium block text-center"
          >
            Register for Updates
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center">
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <Link
            className="text-sm hover:underline hover:text-[#971c61]"
            href="/register"
          >
            Register
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