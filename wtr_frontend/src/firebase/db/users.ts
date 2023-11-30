import { child, get, getDatabase, onValue, ref, set } from 'firebase/database';

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