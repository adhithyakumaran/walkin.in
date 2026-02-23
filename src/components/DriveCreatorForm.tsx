"use client";

import { useState } from "react";
import { createDrive } from "@/lib/firestore";
import { DriveCategory, DriveStatus } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Calendar, Clock, Briefcase, Building, FileText, CheckCircle } from "lucide-react";

export default function DriveCreatorForm({ onSuccess }: { onSuccess: () => void }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [eligibilityStr, setEligibilityStr] = useState("");
    const [docsStr, setDocsStr] = useState("");

    const [formData, setFormData] = useState({
        company: "",
        role: "",
        date: "",
        time: "",
        venue: "",
        mapLink: "",
        category: "Tech" as DriveCategory,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const eligibility = eligibilityStr.split(",").map(s => s.trim()).filter(Boolean);
            const docs = docsStr.split(",").map(s => s.trim()).filter(Boolean);

            await createDrive({
                ...formData,
                eligibility,
                docs,
                status: "Active" as DriveStatus,
                createdBy: user.uid,
            });

            // Reset form
            setFormData({
                company: "",
                role: "",
                date: "",
                time: "",
                venue: "",
                mapLink: "",
                category: "Tech",
            });
            setEligibilityStr("");
            setDocsStr("");
            onSuccess();
        } catch (error) {
            console.error("Error creating drive:", error);
            alert("Failed to create drive. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Drive</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Building size={18} />
                        </div>
                        <input required type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. TCS, Infosys" />
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Briefcase size={18} />
                        </div>
                        <input required type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Junior Java Developer" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Calendar size={18} />
                        </div>
                        <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>

                {/* Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (24h)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Clock size={18} />
                        </div>
                        <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Venue */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                    <div className="relative">
                        <div className="absolute top-2 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin size={18} />
                        </div>
                        <textarea required rows={2} value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Full physical address" />
                    </div>
                </div>

                {/* Map Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                    <input required type="url" value={formData.mapLink} onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://maps.google.com/..." />
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as DriveCategory })} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                            <option value="Tech">Tech</option>
                            <option value="Sales">Sales</option>
                            <option value="Operations">Operations</option>
                            <option value="Finance">Finance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eligibility */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <div className="relative">
                        <div className="absolute top-2 pl-3 flex items-center pointer-events-none text-gray-400">
                            <CheckCircle size={18} />
                        </div>
                        <textarea required rows={2} value={eligibilityStr} onChange={(e) => setEligibilityStr(e.target.value)} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Comma-separated (e.g. 2024/2025 Grads, BE/BTech)" />
                    </div>
                </div>

                {/* Documents */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documents Required</label>
                    <div className="relative">
                        <div className="absolute top-2 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FileText size={18} />
                        </div>
                        <textarea required rows={2} value={docsStr} onChange={(e) => setDocsStr(e.target.value)} className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Comma-separated (e.g. Resume, Aadhar, 2 Photos)" />
                    </div>
                </div>
            </div>

            <button disabled={loading} type="submit" className="mt-4 w-full md:w-auto self-end bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50">
                {loading ? 'Creating...' : 'Publish Drive'}
            </button>
        </form>
    );
}
