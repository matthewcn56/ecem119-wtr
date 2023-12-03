import { get, getDatabase, ref, off, onValue, update } from 'firebase/database';

import firebaseApp from '@/firebase/config';
import IBottleData, { IConsumptionData } from '@/types/IBottleData';

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

export async function checkWaterBottleExists(bottleID: string): Promise<void> {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);

    return new Promise((resolve, reject) => {
        get(bottleRef).then((snapshot) => {
            if (snapshot.exists())
                resolve();
            else
                reject();
        });
    });
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

export async function getWaterBottleConsumption(bottleID: string): Promise<IConsumptionData | null> {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);

    return new Promise((resolve, reject) => {
        get(bottleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const { todaysDate, waterConsumedToday, waterConsumedYesterday } = snapshot.val() as IBottleData;

                if (todaysDate != undefined && waterConsumedToday != undefined && waterConsumedYesterday != undefined) {
                    resolve({ todaysDate, waterConsumedToday, waterConsumedYesterday } as IConsumptionData);
                } else {
                    resolve(null);
                }
            } else {
                reject("Water bottle does not exist");
            }
        }).catch((e) => {
            reject("Error occurred: " + e);
        })
    });
}

export async function updateBottleData(bottleID: string, newBottleData: Partial<IBottleData>): Promise<void> {
    const bottleRef = ref(db, `waterBottles/${bottleID}`);
    
    return new Promise((resolve, reject) => {
        update(bottleRef, newBottleData)
            .then(() => resolve())
            .catch(() => reject());
    });
}