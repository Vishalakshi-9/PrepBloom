'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-[#FFF9DB] border-b border-[#FBB6CE]">
      {/* Logo */}
      <Image src="/logo.svg" width={140} height={80} alt="PrepBloom logo" />

      {/* Navigation */}
      <ul className="hidden md:flex gap-6 text-[#4B2E2E] font-medium">
        {[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Questions', href: '/dashboard/questions' },
          { label: 'Upgrade', href: '/dashboard/upgrade' },
          { label: 'How it works?', href: '/dashboard/how' },
        ].map(({ label, href }) => (
          <li
            key={href}
            className={`cursor-pointer hover:font-semibold hover:text-[#D94878] transition-all ${
              path === href ? 'font-bold text-[#D94878]' : ''
            }`}
          >
            {label}
          </li>
        ))}
      </ul>

      {/* User Profile */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default Header;
