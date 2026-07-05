import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts, calendaritoChromeUrl, getPostUrl, siteUrl } from "./posts";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const metadata: Metadata = {
  title: "Calendarito Blog | Scheduling, Chrome Extensions, and Calendar Tips",
  description:
    "Stories and practical guides from Calendarito about scheduling, Google Calendar, Chrome extensions, and turning messy event sources into calendar entries.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Calendarito Blog",
    description:
      "Scheduling stories and practical guides from Calendarito.",
    url: `${siteUrl}/blog`,
    siteName: "Calendarito",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendarito Blog",
    description:
      "Scheduling stories and practical guides from Calendarito.",
  },
};

function BlogNav() {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 bg-[var(--bg-home)] px-4 pt-4 pb-0 sm:px-6">
      <nav className="mx-auto flex w-full max-w-[900px] items-center justify-between rounded-full bg-white px-4 py-2.5 pl-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8E815]">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-heading text-[15px] font-bold tracking-[-0.03em] text-[#0A0A0A]">
            Calendarito
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-heading hidden text-sm font-medium text-[#555] transition-colors hover:text-[#0A0A0A] sm:inline"
          >
            Home
          </Link>
          <a
            href={calendaritoChromeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading rounded-full bg-[#0A0A0A] px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#333]"
          >
            Add to Chrome
          </a>
        </div>
      </nav>
    </div>
  );
}

export default function BlogIndexPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Calendarito Blog",
    description: metadata.description,
    url: `${siteUrl}/blog`,
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      url: getPostUrl(post),
    })),
  };

  return (
    <main className="min-h-screen bg-[var(--bg-home)] pt-[68px]">
      <BlogNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <section className="px-6 pt-14 pb-10 text-center">
        <p className="font-heading mx-auto mb-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#555] uppercase shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          Calendarito Blog
        </p>
        <h1 className="font-heading mx-auto mb-5 max-w-[860px] text-[clamp(42px,7vw,72px)] leading-[1.05] font-black tracking-[-0.04em] text-[#0A0A0A]">
          Better ways to get events into your calendar
        </h1>
        <p className="mx-auto max-w-[560px] text-base leading-7 text-[#555] md:text-lg">
          Stories, workflow notes, and Chrome extension picks for people who
          live between messages, files, screenshots, and Google Calendar.
        </p>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid w-full max-w-[900px] gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-[#ECECEC] bg-white p-6 text-left no-underline shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-heading rounded-full bg-[#E8E815] px-3 py-1.5 text-xs font-bold text-[#0A0A0A]">
                  {post.category}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-[#777] transition-colors group-hover:text-[#0A0A0A]"
                  aria-hidden="true"
                />
              </div>
              <h2 className="font-heading mb-3 text-2xl leading-tight font-bold tracking-[-0.03em] text-[#0A0A0A]">
                {post.title}
              </h2>
              <p className="mb-6 text-sm leading-6 text-[#555]">
                {post.excerpt}
              </p>
              <p className="text-xs font-medium text-[#888]">
                {dateFormatter.format(new Date(`${post.publishedAt}T00:00:00Z`))} ·{" "}
                {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
