import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, getDoc, query, orderBy, where, serverTimestamp, increment } from 'firebase/firestore';
import { db } from './firebase';
import { Drive, DriveStatus } from './types';

const DRIVES_COLLECTION = 'drives';

// Create a new drive
export const createDrive = async (driveData: Omit<Drive, 'id' | 'createdAt' | 'updatedAt' | 'clicks'>) => {
    const docRef = await addDoc(collection(db, DRIVES_COLLECTION), {
        ...driveData,
        clicks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

// Update drive status
export const updateDriveStatus = async (driveId: string, status: DriveStatus) => {
    const docRef = doc(db, DRIVES_COLLECTION, driveId);
    await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
    });
};

// Fetch all drives (for admin panel)
export const getAllDrives = async (): Promise<Drive[]> => {
    const q = query(collection(db, DRIVES_COLLECTION), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Drive));
};

// Fetch active drives (for public portal)
export const getActiveDrives = async (): Promise<Drive[]> => {
    const q = query(collection(db, DRIVES_COLLECTION), where('status', '==', 'Active'), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Drive));
};

// Increment click counter
export const incrementDriveClicks = async (driveId: string) => {
    const docRef = doc(db, DRIVES_COLLECTION, driveId);
    await updateDoc(docRef, {
        clicks: increment(1)
    });
};

// Delete a drive
export const deleteDrive = async (driveId: string) => {
    await deleteDoc(doc(db, DRIVES_COLLECTION, driveId));
};
