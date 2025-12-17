// useFirestoreUsers.js
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function useFirestoreUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    });

    return () => unsub();
  }, []);

  return users;
}
