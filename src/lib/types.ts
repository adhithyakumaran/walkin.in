export type DriveStatus = 'Active' | 'Expired' | 'Postponed' | 'Full';
export type DriveCategory = 'Tech' | 'Sales' | 'Operations' | 'Finance' | 'Other';

export interface Drive {
    id?: string; // Document ID (optional on creation)
    company: string;
    role: string;
    date: string; // YYYY-MM-DD
    time: string; // 24h format e.g., '09:00'
    venue: string;
    mapLink: string;
    eligibility: string[];
    docs: string[];
    status: DriveStatus;
    category: DriveCategory;
    clicks: number;
    createdBy: string; // UID
    createdAt: number; // Unix timestamp
    updatedAt: number; // Unix timestamp
}
