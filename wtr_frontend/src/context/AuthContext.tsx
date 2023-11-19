"use client"

import React from 'react';
import { getAuth, onIdTokenChanged, User as FirebaseUser} from 'firebase/auth';

import firebaseApp from '@/firebase/config';
import { addUser, attachUserHandler, getUser } from '@/firebase/db/users';
import IUser from '@/types/IUser';

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext<{ user: IUser | null }>({ user: null });
export const useAuthContext = () => React.useContext(AuthContext);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<IUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        return onIdTokenChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
            } else {
                // Check if user exists in the database
                try {
                    const dbUser = await getUser(user.uid);
                    setUser(dbUser);
                } catch(e) {
                    // User does not exist so create one
                    console.log("User does not exist, creating user");
                    addUser({
                        uid: user.uid,
                        email: user.email || "",
                        photoURL: user.photoURL || "",
                        displayName: user.displayName || "",
                    });
                } finally {
                    setLoading(false);

                    // Attach handler to user
                    attachUserHandler(user.uid, (dbUser) => setUser(dbUser));
                }
            }
          });
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};