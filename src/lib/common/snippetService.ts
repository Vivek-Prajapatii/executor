export interface SnippetData {
  code: string;
  title: string;
  createdAt: number;
}

export async function saveSnippet(
  id: string,
  code: string,
  title: string = "Untitled"
): Promise<{ id: string }> {
  const response = await fetch("/api/snippets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, code, title }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save snippet");
  }

  return response.json();
}

export async function getSnippet(id: string): Promise<SnippetData> {
  const response = await fetch(`/api/snippets?id=${encodeURIComponent(id)}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch snippet");
  }

  return response.json();
}

// For real-time updates, we'll use a WebSocket or Server-Sent Events (SSE)
// This is a simplified version - you might want to use a proper WebSocket implementation
// or Firebase's real-time database for more robust real-time features
export function subscribeToSnippet(
  id: string,
  callback: (data: SnippetData | null) => void
) {
  const eventSource = new EventSource(
    `/api/snippets/stream?id=${encodeURIComponent(id)}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback(data);
    } catch (error) {
      console.error("Error parsing real-time update:", error);
    }
  };

  eventSource.onerror = () => {
    console.error("Error in real-time subscription");
    eventSource.close();
    callback(null);
  };

  return () => eventSource.close();
}
