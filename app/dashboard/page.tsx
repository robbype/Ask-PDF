"use client";

import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

interface DocumentItem {
  id: number | string;
  name: string;
  created_at: string;
}

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["listDocument"],
    queryFn: async () => {
      const res = await fetch("/api/documents", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload document");
      return res.json();
    },
    onMutate: () => setIsUploading(true),
    onSettled: () => setIsUploading(false),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listDocument"] }),
    onError: (err: unknown) => {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An error occurred while uploading the document");
      }
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    uploadMutation.mutate(file);
    e.target.value = "";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete document");

      queryClient.invalidateQueries({ queryKey: ["listDocument"] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="text-2xl font-bold text-primary cursor-pointer">ChatPDF</div>
            </Link>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 relative">
          <div
            className={`border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition ${
              isUploading ? "opacity-70 pointer-events-none" : ""
            }`}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Upload a Document</h2>
            <p className="text-muted-foreground mb-4">Drag and drop your file or click to browse</p>

            <input
              id="file-upload"
              type="file"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />

            <Button
              type="button"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>
            {isUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-lg">
                <svg
                  className="w-8 h-8 animate-spin text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span className="ml-2 text-primary font-medium">Uploading...</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Documents</h2>

          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Loading documents...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-12">
              An error occurred while loading documents.
            </p>
          ) : data && data.length > 0 ? (
            <div className="grid gap-4">
              {(data as DocumentItem[]).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <File className="w-8 h-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`chat/${doc.id}`}>
                      <Button size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No documents yet. Upload your first file to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
