import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // <- this should hold db profile, not auth user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Detect user type by email domain or some other way
          const uid = firebaseUser.uid;

          const teacherDocRef = doc(db, "teachers", uid);
          const adminDocRef = doc(db, "admins", uid);

          let docSnap = await getDoc(teacherDocRef);
          if (!docSnap.exists()) {
            docSnap = await getDoc(adminDocRef);
          }

          if (docSnap.exists()) {
            setUser(docSnap.data()); // this should include name, profilePicture, etc.
          } else {
            console.warn("No user document found in teachers or admins");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
