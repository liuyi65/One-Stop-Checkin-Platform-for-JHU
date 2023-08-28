import {initializeApp} from 'firebase/app';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore, collection, addDoc, where, query, getDocs} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCWu95Ey7zQqI4SWeQZbMMb0OdWdETXC_U",
  authDomain: "nona-2098a.firebaseapp.com",
  projectId: "nona-2098a",
  storageBucket: "nona-2098a.appspot.com",
  messagingSenderId: "865912450984",
  appId: "1:865912450984:web:ddd77e6b03a4a22ac2b79d",
  measurementId: "G-4PHH4QDN6K"
};

const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);


const db = getFirestore();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const email = result.user.email
      const name = result.user.displayName
      localStorage.setItem("name", name)
      localStorage.setItem("email", email)
    })
    .catch((error)=>{
      console.log(error)
    })
}
  