import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/apiClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { document_id, question } = body;

  try {
    const apiClient = createApiClient();
    const data = await apiClient.post("/pdf/ask", { document_id, question });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
