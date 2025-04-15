'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Footer() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <footer className="bg-black text-white py-10">
      <div
        data-aos="fade-up"
        className="container mx-auto flex flex-col items-center justify-between px-6 space-y-6 sm:space-y-0 sm:flex-row"
      >
        {/* Logo */}
        <a href="#" className="hover:opacity-80 transition">
          <Image
            src="https://merakiui.com/images/full-logo.svg"
            alt="Logo"
            width={140}
            height={28}
            priority
            className="invert"
          />
        </a>

        {/* Copyright */}
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All Rights Reserved.</p>

        {/* Social Icons */}
        <div className="flex space-x-4">
          {/* Reddit */}
          <a href="#" aria-label="Reddit" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 ... Z" />
            </svg>
          </a>

          {/* Facebook */}
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none">
              <path d="M22 12C22 6.48 17.52 2 ... Z" />
            </svg>
          </a>

          {/* Github */}
          <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 ... Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
