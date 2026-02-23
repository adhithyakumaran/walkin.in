"use client";

import { Drive } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { Building2, MapPin, Calendar, Clock, Navigation, CheckCircle2, ChevronDown, ChevronUp, Users2 } from "lucide-react";
import { useState } from "react";
import DriveChecklist from "./DriveChecklist";
import { incrementDriveClicks } from "@/lib/firestore";

interface DriveCardProps {
    drive: Drive;
}

export default function DriveCard({ drive }: DriveCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleNavigate = () => {
        if (drive.id) incrementDriveClicks(drive.id);
        window.open(drive.mapLink, "_blank");
    };

    const handleExpand = () => {
        if (!isExpanded && drive.id) {
            incrementDriveClicks(drive.id);
        }
        setIsExpanded(!isExpanded);
    };

    // Get company initials for the logo placeholder
    const initials = drive.company ? drive.company.substring(0, 2).toUpperCase() : "NA";

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100/80 overflow-hidden hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300">
            {/* Top Section / Header */}
            <div
                className="p-5 sm:p-6 cursor-pointer relative"
                onClick={handleExpand}
            >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-between">

                    <div className="flex gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-100 border border-primary-100/50 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner shrink-0">
                            {initials}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">{drive.role}</h3>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-600 font-medium text-sm mb-3">
                                <Building2 size={16} className="text-gray-400" />
                                <span>{drive.company}</span>
                                <span className="text-gray-300 mx-1">•</span>
                                <StatusBadge status={drive.status} />
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[13px] text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>{new Date(drive.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Clock size={14} className="text-gray-400" />
                                    <span>{drive.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Users2 size={14} className="text-gray-400" />
                                    <span>{drive.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end justify-between">
                        <div className="bg-primary-50/50 w-10 h-10 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Details Section */}
            {isExpanded && (
                <div className="border-t border-gray-100/80 bg-gray-50/30 p-5 sm:p-6 animate-in slide-in-from-top-1 fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                        {/* Left Col: Info */}
                        <div className="md:col-span-3 space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-md">
                                        <MapPin size={16} className="text-primary-600" />
                                    </div>
                                    Venue Location
                                </h4>
                                <p className="text-[14px] text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">{drive.venue}</p>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                                    className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-medium transition-transform active:scale-95 shadow-md w-full sm:w-auto justify-center"
                                >
                                    <Navigation size={16} />
                                    Open in Google Maps
                                </button>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-white shadow-sm border border-gray-100 rounded-md">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                    </div>
                                    Eligibility Criteria
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {drive.eligibility.map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-lg shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Checklist */}
                        <div className="md:col-span-2">
                            <DriveChecklist driveId={drive.id!} documents={drive.docs} title={drive.company} date={drive.date} time={drive.time} venue={drive.venue} />
                        </div>

                    </div>
                </div>
            )}

            {/* Mobile Footer Toggle */}
            <div
                onClick={handleExpand}
                className="sm:hidden px-5 py-3 border-t border-gray-100/50 flex items-center justify-center gap-2 text-gray-400 text-sm font-medium hover:text-gray-600 hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
                {isExpanded ? "Show Less" : "View Details"}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
        </div>
    );
}
