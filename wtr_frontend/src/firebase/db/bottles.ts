import { getDatabase, ref, onValue } from 'firebase/database';

import firebaseApp from '@/firebase/config';
import IBottleData from '@/types/IBottleData';

const db = getDatabase(firebaseApp);

export function attachBottleHandler(bottleID: string, callback: (arg0: IBottleData) => any) {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);
    onValue(bottleRef, (snapshot) => {
        const bottleData = snapshot.val();
        callback(bottleData);
    });
}