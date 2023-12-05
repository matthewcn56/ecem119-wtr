import { child, get, getDatabase, onValue, ref, set, update } from 'firebase/database';

import firebaseApp from '@/firebase/config';
import IUser from '@/types/IUser';

const db = getDatabase(firebaseApp);
const dbRef = ref(db);

export async function getUser(uid: string) {
    return new Promise<IUser>((resolve, reject) => {
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
            if (!snapshot.exists())
                return reject("User does not exist!");
            
            resolve(snapshot.val());
        });
    });
}

export async function checkUserExists(uid: string): Promise<void> {
    const userRef = ref(db, `users/${uid}`);

    return new Promise((resolve, reject) => {
        get(userRef).then((snapshot) => {
            if (snapshot.exists())
                resolve();
            else
                reject();
        });
    });
}

export function addUser(user: Partial<IUser>) {
    set(
        ref(db, `users/${user.uid}`),
        user
    );
}

export function attachUserHandler(uid: string, callback: (arg0: IUser) => any) {
    const userRef = ref(db, `users/${uid}`);
    onValue(userRef, (snapshot) => {
        console.log("Updated user detected");

        const userData = snapshot.val();
        callback(userData);
    });
}

export async function addUserWaterBottles(uid: string, bottleId: string): Promise<void> {
    const userRef = ref(db, `users/${uid}`);
    return getUser(uid).then((user) => {
        update(userRef, {
            'waterBottles': [...(user.waterBottles ?? []), ...(user.waterBottles && user.waterBottles.includes(bottleId) ? [] : [bottleId])]
        });
    });
}

export async function addUserFriend(uid: string, friendUid: string): Promise<void> {
    const userRef1 = ref(db, `users/${uid}`);
    const userRef2 = ref(db, `users/${friendUid}`);

    return new Promise(async (resolve, reject) => {
        if (uid == friendUid) {
            reject();
            return;
        }

        await Promise.all([
            getUser(uid).then((user) => {
                update(userRef1, {
                    'familyMembers': [...(user.familyMembers ?? []), ...(user.familyMembers && user.familyMembers.includes(friendUid) ? [] : [friendUid])]
                });
            }),
            getUser(friendUid).then((user) => {
                update(userRef2, {
                    'familyMembers': [...(user.familyMembers ?? []), ...(user.familyMembers && user.familyMembers.includes(uid) ? [] : [uid])]
                });
            }),
        ]);
        resolve();
    });
}