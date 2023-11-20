import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import firebaseApp from '@/firebase/config';

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default function init() {
    signInWithPopup(auth, provider);
}