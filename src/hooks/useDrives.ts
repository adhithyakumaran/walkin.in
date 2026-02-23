"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Drive } from '@/lib/types';

export function useDrives() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all drives to manage Ongoing/Upcoming/Completed tabs
        const q = query(
            collection(db, 'drives'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const drivesData: Drive[] = [];
            snapshot.forEach((doc) => {
                drivesData.push({ id: doc.id, ...doc.data() } as Drive);
            });
            setDrives(drivesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching drives in real-time:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { drives, loading };
}
