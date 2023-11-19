"use client"

import React from 'react';
import { getAuth, onIdTokenChanged, User as FirebaseUser} from 'firebase/auth';

import firebaseApp from '@/firebase/config';
import { addUser, getUser } from '@/firebase/db/users';

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext<{ user: FirebaseUser | null }>({ user: null });
export const useAuthContext = () => React.useContext(AuthContext);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<FirebaseUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        return onIdTokenChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
            } else {
                const token = await user.getIdToken();
                setUser(user);
                setLoading(false);

                // Check if user exists in the database
                try {
                    await getUser(user.uid);
                } catch(e) {
                    // User does not exist so create one
                    console.log("User does not exist, creating user");
                    addUser({
                        uid: user.uid,
                        email: user.email || "",
                        photoURL: user.photoURL || "",
                        displayName: user.displayName || "",
                    });
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