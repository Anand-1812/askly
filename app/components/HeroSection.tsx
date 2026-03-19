import React from "react";
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import Link from "next/link";
import slugify from "@/utils/slugify";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";

export default async function HeroSection() {
  let recentQuestions: any[] = [];

  try {
    const response = await databases.listDocuments(db, questionCollection, [
      Query.orderDesc("$createdAt"),
      Query.limit(6),
    ]);
    recentQuestions = response.documents;
  } catch (error) {
    console.error("HeroSection error:", error);
  }

  return (
    <section className="w-full">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Ask. Answer.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Evolve.
            </span>
          </h1>
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
            Join our community of developers. Share knowledge, solve problems, and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/questions/ask"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Ask a Question
              <IconArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/questions"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
            >
              <IconSearch className="w-5 h-5 mr-2" />
              Browse Questions
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      {recentQuestions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Recent Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentQuestions.map((q) => (
              <Link
                key={q.$id}
                href={`/questions/${q.$id}/${slugify(q.title)}`}
                className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-muted transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {q.title}
                </h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mb-4">
                  {q.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-foreground/50">
                    <span>{q.answers?.length || 0} answers</span>
                    <span>{q.votes?.length || 0} votes</span>
                  </div>
                  <IconArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
