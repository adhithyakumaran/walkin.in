"use client";

import { useState, useMemo } from "react";
import { useDrives } from "@/hooks/useDrives";
import DriveCard from "@/components/DriveCard";
import FilterBar from "@/components/FilterBar";
import { TopNav, BottomNav } from "@/components/Navigation";
import { BriefcaseBusiness, Inbox } from "lucide-react";

export default function Home() {
  const { drives, loading } = useDrives();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Ongoing" | "Completed">("Ongoing");

  // Separate and filter drives
  const processedDrives = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return drives.filter(drive => {
      // 1. Search Query
      const matchesSearch =
        drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Pill Filter
      if (activeFilter !== "All" && activeFilter !== "Today" && drive.category !== activeFilter) {
        return false;
      }

      // 3. Tab logic
      if (activeTab === "Ongoing") return drive.date === today && drive.status === "Active";
      if (activeTab === "Upcoming") return drive.date > today && drive.status === "Active";
      if (activeTab === "Completed") return drive.status !== "Active" || drive.date < today;

      return false;
    });
  }, [drives, searchQuery, activeFilter, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50/50 dot-pattern pb-24 md:pb-0">
      <TopNav />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start relative">

          {/* LEFT SIDEBAR - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
            {/* User Profile / Quick Stats Mock */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-primary-500 to-blue-400"></div>
              <div className="px-5 pb-5">
                <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-sm -mt-8 mb-3 flex items-center justify-center overflow-hidden relative z-10">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 leading-tight">Welcome back</h3>
                  <p className="text-[13px] text-gray-500 font-medium mt-0.5">Guest User</p>
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">Profile Views</span>
                    <span className="font-bold text-primary-600">--</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">Saved Drives</span>
                    <span className="font-bold text-gray-900">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] border border-gray-100 p-5">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4">Discover</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[14px] text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2"><BriefcaseBusiness size={16} /> Top Companies</a></li>
                <li><a href="#" className="text-[14px] text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2"><Inbox size={16} /> Applied Drives</a></li>
              </ul>
            </div>
          </aside>


          {/* CENTER FEED */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-6 space-y-6">

            {/* Dynamic Search & Filter section */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            {/* Tab Navigation */}
            <div className="flex w-full bg-gray-100/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("Ongoing")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "Ongoing" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setActiveTab("Upcoming")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "Upcoming" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("Completed")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "Completed" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Completed
              </button>
            </div>

            {/* Feed List (Single Column) */}
            <div className="space-y-5">
              {loading ? (
                // Mock Data Skeleton Cards
                [1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2 w-3/4">
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))
              ) : processedDrives.length === 0 ? (
                <>
                  <div className="mb-4 bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded-lg shrink-0">
                      <Inbox size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary-900">No live drives found</h4>
                      <p className="text-sm text-primary-700 mt-0.5 leading-relaxed">We couldn't find any drives matching your criteria from the server right now. Here are some mock examples.</p>
                    </div>
                  </div>

                  <DriveCard drive={{
                    id: "mock-1",
                    company: "Tech Mahindra",
                    role: "Junior Software Engineer",
                    date: new Date().toISOString().split('T')[0],
                    time: "10:00 AM",
                    venue: "Tech Mahindra Hinjewadi Campus Phase 3, Pune",
                    mapLink: "https://maps.google.com",
                    category: "Tech",
                    eligibility: ["2023/2024 Batch", "B.Tech/BE", "60% above"],
                    docs: ["Updated Resume", "Aadhar Card", "2 Passport Photos", "Degree Certificate"],
                    status: "Active",
                    createdBy: "system",
                    clicks: 142,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                  }} />

                  <DriveCard drive={{
                    id: "mock-2",
                    company: "Cognizant Technology Solutions",
                    role: "Process Executive - Voice",
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    time: "09:30 AM",
                    venue: "Cognizant MEPZ Campus, Tambaram, Chennai",
                    mapLink: "https://maps.google.com",
                    category: "Operations",
                    eligibility: ["Any Graduate", "Excellent Communication", "Willing to work shifts"],
                    docs: ["Printout of Resume", "Original Govt ID", "Vaccination Certificate"],
                    status: "Active",
                    createdBy: "system",
                    clicks: 89,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                  }} />

                  <DriveCard drive={{
                    id: "mock-3",
                    company: "Bank of America",
                    role: "Financial Analyst Intern",
                    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                    time: "11:00 AM",
                    venue: "Bank of America, Mindspace, Malad West, Mumbai",
                    mapLink: "https://maps.google.com",
                    category: "Finance",
                    eligibility: ["B.Com/M.Com/MBA Finance", "Knowledge of Excel"],
                    docs: ["Resume", "College ID", "Mark sheets"],
                    status: "Active",
                    createdBy: "system",
                    clicks: 215,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                  }} />
                </>
              ) : (
                processedDrives.map((drive) => (
                  <DriveCard key={drive.id} drive={drive} />
                ))
              )}
            </div>
          </div>


          {/* RIGHT SIDEBAR - X-Large Desktop Only */}
          <aside className="hidden xl:block xl:col-span-3 sticky top-24 space-y-5">
            {/* Download App Board */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-md p-6 text-white overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-500 rounded-full blur-[40px] opacity-50"></div>
              <h3 className="text-[17px] font-bold mb-2">Get DriveBoard App</h3>
              <p className="text-[13px] text-gray-300 mb-5 leading-relaxed">Never miss a walk-in drive again. Get real-time push notifications.</p>
              <button className="bg-white text-gray-900 w-full py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                Download Now
              </button>
            </div>

            {/* Preparation Tips */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] border border-gray-100 p-5">
              <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4">Interview Tips</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="group block">
                    <h5 className="text-[14px] font-bold text-gray-800 group-hover:text-primary-600 leading-tight mb-1">How to ace Group Discussions</h5>
                    <p className="text-[12px] text-gray-400">Read the 3 core principles.</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="group block">
                    <h5 className="text-[14px] font-bold text-gray-800 group-hover:text-primary-600 leading-tight mb-1">Top 50 HR Questions</h5>
                    <p className="text-[12px] text-gray-400">Download the free cheat-sheet.</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="group block">
                    <h5 className="text-[14px] font-bold text-gray-800 group-hover:text-primary-600 leading-tight mb-1">Dress Code Guide</h5>
                    <p className="text-[12px] text-gray-400">What to wear to a walk-in.</p>
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px] text-gray-400 px-2 leading-relaxed">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Help Center</a>
              <a href="#" className="hover:underline">Privacy & Terms</a>
              <span className="w-full mt-1 flex items-center gap-1">DriveBoard Corp © 2026</span>
            </div>
          </aside>

        </div>
      </main>

      <BottomNav />

      {/* CSS Background Pattern */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .dot-pattern {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}} />
    </div>
  );
}
