"use client";

import { Home, Briefcase, User, Search, Bell, LayoutGrid } from "lucide-react";
import { useState } from "react";

export function TopNav() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 transition-shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-primary-600 to-blue-500 text-white p-1.5 rounded-xl shadow-sm">
                        <LayoutGrid size={22} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">DriveBoard</span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
                        <Search size={22} className="stroke-[2.5px]" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
                        <Bell size={22} className="stroke-[2.5px]" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <a href="/admin/login" className="hidden sm:flex ml-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-sm">
                        Post Drive
                    </a>
                </div>
            </div>
        </header>
    );
}

export function BottomNav() {
    const [active, setActive] = useState("home");

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex justify-around items-center h-16 px-4">
                <button
                    onClick={() => setActive("home")}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active === "home" ? "text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <Home size={22} className={active === "home" ? "stroke-[2.5px]" : ""} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button
                    onClick={() => setActive("jobs")}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active === "jobs" ? "text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <Briefcase size={22} className={active === "jobs" ? "stroke-[2.5px]" : ""} />
                    <span className="text-[10px] font-medium">Drives</span>
                </button>
                <button
                    onClick={() => setActive("profile")}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active === "profile" ? "text-primary-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <User size={22} className={active === "profile" ? "stroke-[2.5px]" : ""} />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>
        </nav>
    );
}
