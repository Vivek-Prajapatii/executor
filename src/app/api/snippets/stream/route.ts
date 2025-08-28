import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID is required", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const MAX_CODE_SIZE = 100 * 1024; // 100KB in bytes

  const docRef = doc(db, "codeSnippets", id);

  const unsubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const codeSize = data.code
          ? new TextEncoder().encode(data.code).length
          : 0;

        if (codeSize > MAX_CODE_SIZE) {
          writer.write(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({
                error: "Code size exceeds the maximum allowed limit of 100KB",
                size: `${(codeSize / 1024).toFixed(2)}KB`,
              })}\n\n`
            )
          );
          writer.close().catch(console.error);
          return;
        }

        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
    },
    (error) => {
      console.error("Error in real-time subscription:", error);
      writer.write(
        encoder.encode(
          `event: error\ndata: ${JSON.stringify({
            error: "Failed to subscribe to updates",
          })}\n\n`
        )
      );
      writer.close().catch(console.error);
    }
  );

  // Handle client disconnection
  request.signal.addEventListener("abort", () => {
    unsubscribe();
    writer.close().catch(console.error);
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
