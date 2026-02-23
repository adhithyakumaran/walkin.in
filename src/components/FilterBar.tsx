"use client";

import { Search, Filter } from "lucide-react";

interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    activeFilter: string;
    setActiveFilter: (f: string) => void;
}

export default function FilterBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: FilterBarProps) {
    const filters = ["All", "Today", "Tech", "Sales", "Operations", "Finance"];

    return (
        <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative w-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} className="stroke-[2.5px]" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by company or role keyword..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100/80 rounded-2xl text-[15px] text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-sm font-semibold"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar flex-nowrap w-full">
                <div className="bg-gray-100/80 p-2.5 rounded-xl text-gray-500 shrink-0 hidden sm:block">
                    <Filter size={18} strokeWidth={2.5} />
                </div>
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-bold transition-all shrink-0 ${activeFilter === f ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
}
