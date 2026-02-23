"use client";

import { useState, useEffect } from "react";
import { Check, CalendarPlus } from "lucide-react";

interface DriveChecklistProps {
    driveId: string;
    documents: string[];
    title: string; // company name
    date: string;
    time: string;
    venue: string;
}

export default function DriveChecklist({ driveId, documents, title, date, time, venue }: DriveChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem(`drive_checklist_${driveId}`);
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) { }
        }
    }, [driveId]);

    const toggleItem = (doc: string) => {
        const updated = { ...checkedItems, [doc]: !checkedItems[doc] };
        setCheckedItems(updated);
        localStorage.setItem(`drive_checklist_${driveId}`, JSON.stringify(updated));
    };

    const generateCalendarUrl = () => {
        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // assume 4 hours

        const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const details = `Walk-in drive by ${title}%0A%0ARequired Documents:%0A${documents.map(d => `- ${d}`).join('%0A')}`;
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${title} Walk-In Drive`)}&dates=${formatDate(start)}/${formatDate(end)}&details=${details}&location=${encodeURIComponent(venue)}`;
    };

    const progress = documents.length > 0
        ? Math.round((Object.values(checkedItems).filter(Boolean).length / documents.length) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl border border-primary-100 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-primary-900">Preparation Checklist</h4>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{progress}% Ready</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                <div className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <ul className="space-y-2 mb-5">
                {documents.map((docItem, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => toggleItem(docItem)}
                    >
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checkedItems[docItem] ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 group-hover:border-primary-400 bg-white'}`}>
                            {checkedItems[docItem] && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className={`text-sm ${checkedItems[docItem] ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{docItem}</span>
                    </li>
                ))}
            </ul>

            <a
                href={generateCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
            >
                <CalendarPlus size={16} />
                Add to Google Calendar
            </a>
        </div>
    );
}
