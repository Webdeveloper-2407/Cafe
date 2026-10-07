import React from 'react';

export function CafeLeafIcon({ className = 'w-6 h-6 text-[#6B4226]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Two symmetric stylized coffee leaves / beans matching reference design */}
      <path d="M12 14c-1.8 0-3.5-.8-4.7-2.1C6.1 10.6 5.5 8.8 5.6 7c1.8.1 3.6.7 4.9 1.9 1.3 1.2 2 2.9 1.9 4.7l-.4.4zm-.7-1.4c.1-1.3-.4-2.5-1.4-3.4-.9-.9-2.1-1.4-3.4-1.5-.1 1.3.4 2.5 1.4 3.4 1 1 2.2 1.5 3.4 1.5z" />
      <path d="M12 14c1.8 0 3.5-.8 4.7-2.1 1.2-1.3 1.8-3.1 1.7-4.9-1.8.1-3.6.7-4.9 1.9-1.3 1.2-2 2.9-1.9 4.7l.4.4zm.7-1.4c-.1-1.3.4-2.5 1.4-3.4.9-.9 2.1-1.4 3.4-1.5.1 1.3-.4 2.5-1.4 3.4-1 1-2.2 1.5-3.4 1.5z" />
      <circle cx="12" cy="15" r="1.5" />
    </svg>
  );
}
