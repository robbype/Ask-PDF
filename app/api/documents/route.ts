import { createApiClient } from "@/lib/apiClient";

export async function GET() {
  const apiClient = createApiClient();
  try {
    const data = await apiClient.get("/user/documents");
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to get documents" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiClient = createApiClient();
    const data = await apiClient.post("/pdf/upload-pdf", formData);

    return Response.json(data);
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
