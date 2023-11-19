import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

import firebaseApp from '@/firebase/config';

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default function init() {
    signInWithRedirect(auth, provider);
}