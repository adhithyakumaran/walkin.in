"use client";

import { useEffect, useState } from "react";
import DriveCreatorForm from "@/components/DriveCreatorForm";
import StatusBadge from "@/components/StatusBadge";
import { getAllDrives, updateDriveStatus, deleteDrive } from "@/lib/firestore";
import { Drive, DriveStatus } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Trash2 } from "lucide-react";

export default function AdminDashboard() {
    const { logout, user } = useAuth();
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDrives = async () => {
        setLoading(true);
        try {
            const data = await getAllDrives();
            setDrives(data);
        } catch {
            console.error("Failed to fetch drives");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleStatusChange = async (id: string, newStatus: DriveStatus) => {
        try {
            await updateDriveStatus(id, newStatus);
            setDrives(drives.map(d => d.id === id ? { ...d, status: newStatus } : d));
        } catch {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this drive?")) return;
        try {
            await deleteDrive(id);
            setDrives(drives.filter(d => d.id !== id));
        } catch {
            alert("Failed to delete drive");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Logged in as {user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} /> Sign out
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="xl:col-span-1">
                    <DriveCreatorForm onSuccess={fetchDrives} />
                </div>

                {/* Right Column: Listing Table */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Manage Drives</h3>
                            <div className="flex gap-2">
                                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {drives.length} Total
                                </span>
                                <span className="bg-success-50 text-success-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {drives.filter(d => d.status === 'Active').length} Active
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Company & Role</th>
                                        <th className="px-6 py-4 font-medium">Date & Time</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Clicks</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading drives...</td>
                                        </tr>
                                    ) : drives.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No drives found. Create one to get started!</td>
                                        </tr>
                                    ) : drives.map((drive) => (
                                        <tr key={drive.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{drive.company}</div>
                                                <div className="text-gray-500">{drive.role}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900">{drive.date}</div>
                                                <div className="text-gray-500 text-xs">{drive.time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <StatusBadge status={drive.status} />
                                                    <select
                                                        value={drive.status}
                                                        onChange={(e) => handleStatusChange(drive.id!, e.target.value as DriveStatus)}
                                                        className="bg-white border flex border-gray-200 text-xs rounded px-1 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                    >
                                                        <option value="Active">Mark Active</option>
                                                        <option value="Expired">Mark Expired</option>
                                                        <option value="Postponed">Mark Postponed</option>
                                                        <option value="Full">Mark Full</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-700">{drive.clicks || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(drive.id!)}
                                                    className="text-gray-400 hover:text-danger-600 transition-colors p-2 rounded hover:bg-danger-50"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
