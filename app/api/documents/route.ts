import { cookies } from "next/headers";
import { createApiClient } from "@/lib/apiClient";

export async function GET() {
  const apiClient = createApiClient();
  try {
    const data = await apiClient.get("/documents");
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to get documents" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;
  const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const serverForm = new FormData();
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    serverForm.append("file", blob, file.name);

    const res = await fetch(`${BASE_URL}/documents/`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: serverForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${errText}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err: any) {
    console.error("POST /documents error:", err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
