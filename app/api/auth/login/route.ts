import { NextResponse } from "next/server";
import { createApiClient } from "@/lib/apiClient";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const apiClient = createApiClient();

  try {
    const data = await apiClient.post("/auth/login", { username, password });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 400 });
  }
}
