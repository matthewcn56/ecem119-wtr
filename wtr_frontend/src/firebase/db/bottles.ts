import { get, getDatabase, ref, off, onValue, update } from 'firebase/database';

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

export function removeBottleHandler(bottleID: string) {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);
    off(bottleRef);
}

export async function getWaterBottleName(bottleID: string): Promise<string> {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);

    return new Promise((resolve, reject) => {
        get(bottleRef).then((snapshot) => {
            if (snapshot.exists()) {
                resolve((snapshot.val() as IBottleData).name); 
            } else {
                reject("Water bottle does not exist");
            }
        }).catch((e) => {
            reject("Error occurred: " + e);
        });
    });
}

export function updateBottleData(bottleID: string, newBottleData: Partial<IBottleData>) {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);
    update(bottleRef, newBottleData);
}