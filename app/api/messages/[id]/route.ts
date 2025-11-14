import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/apiClient";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const api = createApiClient();

  try {
    const res = await api.get(`/pdf/messages/${id}`);

    return NextResponse.json(res);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch messages" }, { status: 500 });
  }
}
