import { createApiClient } from "@/lib/apiClient";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const apiClient = createApiClient();

  const res = await apiClient.delete(`/pdf/documents/${id}`);

  return NextResponse.json(res);
}
