import { cookies } from "next/headers";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, any>;
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  return (
    "?" +
    Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&")
  );
}

export function createApiClient() {
  async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const token = (await cookies()).get("token")?.value;
    const query = buildQuery(options.params);

    let headers: HeadersInit = { ...options.headers };
    let body: any = undefined;

    if (options.body instanceof FormData) {
      body = options.body;
    } else if (options.body) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${url}${query}`, {
      ...options,
      headers,
      body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return res.json() as Promise<T>;
  }

  return {
    get: <T>(url: string, params?: Record<string, any>) =>
      request<T>(url, { method: "GET", params }),
    post: <T>(url: string, body?: any) => request<T>(url, { method: "POST", body }),
    put: <T>(url: string, body?: any) => request<T>(url, { method: "PUT", body }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  };
}
