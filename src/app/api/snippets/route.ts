import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/**
 * Gets the code snippet from the database
 * @param id - The unique identifier for the code snippet
 * @returns The code snippet if successful, null otherwise
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Snippet ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "codeSnippets", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json(docSnap.data());
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

/**
 * Saves the code snippet to the database
 * @param request - The request object containing the code snippet
 * @returns The unique identifier for the code snippet if successful, null otherwise
 */
export async function POST(request: Request) {
  try {
    const { id, code, title } = await request.json();

    if (!id || !code) {
      return NextResponse.json(
        { error: "ID and code are required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "codeSnippets", id);

    await setDoc(
      docRef,
      {
        code,
        title: title || "Untitled",
        createdAt: Date.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error saving snippet:", error);
    return NextResponse.json(
      { error: "Failed to save snippet" },
      { status: 500 }
    );
  }
}


