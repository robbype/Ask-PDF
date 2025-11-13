"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold text-primary cursor-pointer">ChatPDF</div>
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Talk to Your PDFs with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Upload any PDF and instantly chat with its content. Ask questions, extract information,
            and get insights powered by AI.
          </p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border hover:shadow-md transition">
              <Upload className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop any PDF file. Supports documents of any size.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border hover:shadow-md transition">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Chat</h3>
              <p className="text-muted-foreground">
                Ask questions about your PDF and get instant, accurate answers.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border hover:shadow-md transition">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get responses in seconds with our optimized AI engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start chatting with your PDFs today. No credit card required.
        </p>
        <Link href="/signup">
          <Button size="lg">Sign Up for Free</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 ChatPDF. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
