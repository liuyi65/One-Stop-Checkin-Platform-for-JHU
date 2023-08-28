import React, { useContext, useState, useEffect } from "react"
import { auth, signInWithGoogle } from "../firebase"
import { EmailAuthProvider, getAuth, reauthenticateWithCredential , signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, 
  updateEmail, updatePassword, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

const AuthContext = React.createContext({
  certified: null,
  setCertified: () => {},
  currentUser: null,
});
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [certified, setCertified] = useState(null)

  function signup(email, password) {
    const auth = getAuth()
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    const auth = getAuth()
    if (email == null){
      return signInWithGoogle()
    }
    else{
      return signInWithEmailAndPassword(auth, email, password)
    }
   
  }

  function logout() {
    const auth = getAuth()
    return signOut(auth)
  }


  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function MyUpdateEmail(email) {
    const auth = getAuth()
    return updateEmail(auth.currentUser, email)
  }

  async function MyUpdatePassword(oldPassword, newPassword) {
    const auth = getAuth()
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    )
    
    await reauthenticateWithCredential(auth.currentUser, credential).then(() => {
      console.log("success")
    }).catch((error) => {
      // An error occurred
      console.log(error)
    });
    return updatePassword(auth.currentUser, newPassword)
    // .then(() => {
    //   // Email updated!
    //   // ...
    // }).catch((error) => {
    //   // An error occurred
    //   console.log(error)
    // });
    // return "dddd"
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    certified,
    setCertified,
    login,
    signup,
    logout,
    resetPassword,
    MyUpdateEmail,
    MyUpdatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
