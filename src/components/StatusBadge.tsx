import { DriveStatus } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function StatusBadge({ status }: { status: DriveStatus }) {
    const getStatusColor = () => {
        switch (status) {
            case 'Active': return 'bg-success-50 text-success-700 border-success-200/60 shadow-sm';
            case 'Expired': return 'bg-danger-50 text-danger-700 border-danger-200/60 shadow-sm';
            case 'Postponed': return 'bg-warning-50 text-warning-700 border-warning-200/60 shadow-sm';
            case 'Full': return 'bg-gray-50 text-gray-700 border-gray-200/60 shadow-sm';
            default: return 'bg-gray-50 text-gray-700 border-gray-200/60 shadow-sm';
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getStatusColor()
        )}>
            {status}
        </span>
    );
}
