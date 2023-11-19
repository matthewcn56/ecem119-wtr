import { getAuth, signOut } from "firebase/auth";

import firebaseApp from "../config";

const auth = getAuth(firebaseApp);

export default function init() {
    signOut(auth);
}