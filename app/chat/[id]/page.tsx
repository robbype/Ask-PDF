"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
  const params = useParams();
  const documentId = params.id as string;
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", documentId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${documentId}`);
      if (!res.ok) {
        const text = await res.text();

        throw new Error(text);
      }
      return res.json();
    },
    enabled: !!documentId,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsSending(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: documentId,
          question: userInput,
        }),
      });

      queryClient.invalidateQueries({
        queryKey: ["messages", documentId],
      });

      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setUserInput("");
      setIsSending(false);
    }
  };

  if (!documentId) return <div>No PDF selected</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">PDF ID: {documentId}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {isLoading && <p className="text-center text-muted-foreground">Loading messages...</p>}
          {isError && <p className="text-center text-red-500">Failed to load messages</p>}

          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t bg-card sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto px-4 py-4 flex gap-2">
          <Input
            value={userInput}
            placeholder="Ask something…"
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!userInput.trim() || isSending}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
