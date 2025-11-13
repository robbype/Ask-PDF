import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/apiClient";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  const apiClient = createApiClient();

  try {
    const data = await apiClient.post("/auth/register", { username, email, password });

    const response = NextResponse.json({ success: true });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 400 });
  }
}
