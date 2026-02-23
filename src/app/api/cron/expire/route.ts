import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Add a simple secret check for Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        // Find all Active drives where date < today
        const q = query(
            collection(db, 'drives'),
            where('status', '==', 'Active'),
            where('date', '<', today)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return NextResponse.json({ message: 'No drives to expire today', count: 0 });
        }

        const batch = writeBatch(db);
        let count = 0;

        snapshot.forEach((doc) => {
            // It's safer to double-check in JS since Firestore inequality on strings can be tricky
            if (doc.data().date < today) {
                batch.update(doc.ref, {
                    status: 'Expired',
                    updatedAt: new Date().getTime()
                });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
        }

        return NextResponse.json({ message: 'Success', expiredCount: count });
    } catch (error: any) {
        console.error('Auto-expire cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
