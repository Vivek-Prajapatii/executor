// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { app, db };

// The code snippet data could be just "code" or have a name, description, etc.
export async function saveCodeSnippet(
  uuid: string,
  code: string,
  title: string = ""
) {
  try {
    await setDoc(doc(db, "codeSnippets", uuid), {
      code,
      title,
      createdAt: Date.now(),
    });
    return uuid; // Use this to share, retrieve, etc.
  } catch (error) {
    console.error("Error saving code snippet:", error);
    return null;
  }
}

export function getRealTimeSnippets(
  uuid: string,
  callback: (
    data: { code: string; title: string; createdAt: number } | null
  ) => void
) {
  const docRef = doc(db, "codeSnippets", uuid);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(
        docSnap.data() as { code: string; title: string; createdAt: number }
      );
    } else {
      callback(null);
    }
  });

  // Return unsubscribe function to allow cleanup
  return unsubscribe;
}
export async function readCodeSnippet(uuid: string): Promise<string | null> {
  try {
    const docSnap = await getDoc(doc(db, "codeSnippets", uuid));
    console.log(docSnap);
    if (docSnap.exists()) {
      // Access other fields if needed: docSnap.data().title, createdAt, etc.
      console.log(docSnap.data().code as string);
      return docSnap.data().code as string;
    } else {
      return null; // Doc does not exist
    }
  } catch (error) {
    // Optional: log the error for debugging
    console.error("Error fetching snippet:", error);
    return null; // On error, return null or a custom error value
  }
}
