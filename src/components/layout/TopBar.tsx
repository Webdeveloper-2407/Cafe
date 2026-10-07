import React from 'react';
import { Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-[#EFE8DF] border-b border-[#E3D7C9] text-[#634832] text-xs font-medium py-2 px-4 md:px-8 tracking-wide transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Tagline */}
        <div className="flex items-center gap-2">
          <span>Good Coffee, Good Mood</span>
        </div>

        {/* Right: Hours & Socials */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7A5034]" />
            <span>Mon-Sun: 7:00 AM – 9:00 PM</span>
          </div>

          <div className="flex items-center gap-2.5 text-[#634832]/80">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3D2314] transition-colors p-0.5"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3D2314] transition-colors p-0.5"
              aria-label="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3D2314] transition-colors p-0.5"
              aria-label="Twitter / X"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3D2314] transition-colors p-0.5"
              aria-label="Pinterest"
            >
              {/* Pinterest icon SVG */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.379l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
