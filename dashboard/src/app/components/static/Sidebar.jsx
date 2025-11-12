'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, CalendarDays, ListChecks, UserCog, LogOut } from 'lucide-react';

const topLinks = [
  { name: 'Users', href: '/', icon: Users },
  { name: 'Fixtures', href: '/fixtures', icon: CalendarDays },
  { name: 'Results', href: '/results', icon: ListChecks },
  { name: 'Staff', href: '/staff', icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-black/70 shadow-sm text-white min-h-screen w-[72px] lg:w-[240px] transition-all p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-center lg:justify-start mt-10 items-center mb-8">
          <span className="mr-0 lg:mr-3 text-[30px]">⚽</span>
          <span className="hidden lg:block text-xl font-semibold">UTF Dashboard</span>
        </div>

        <nav className="space-y-2 mt-16">
          {topLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center space-x-4 px-3 py-2 rounded-md transition hover:bg-[rgb(0,191,255)] ${
                pathname === href ? 'bg-white text-[rgb(0,191,255)] font-semibold' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <Link
          href="/logout"
          className="flex justify-center items-center space-x-3 px-3 py-2 rounded-md transition hover:bg-[rgb(0,191,255)]"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden lg:inline text-sm">Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
