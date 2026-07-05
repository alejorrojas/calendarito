import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPosts,
  calendaritoChromeUrl,
  getBlogPost,
  getPostUrl,
  siteUrl,
} from "../posts";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post not found | Calendarito Blog",
    };
  }

  const url = getPostUrl(post);

  return {
    title: `${post.title} | Calendarito Blog`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "Calendarito",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Calendarito"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

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
            href="/blog"
            className="font-heading hidden text-sm font-medium text-[#555] transition-colors hover:text-[#0A0A0A] sm:inline"
          >
            Blog
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = getPostUrl(post);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "Calendarito",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Calendarito",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/calendarito-mark.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[var(--bg-home)] pt-[68px]">
      <BlogNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="mx-auto max-w-[760px] px-6 py-14">
        <Link
          href="/blog"
          className="font-heading mb-8 inline-flex text-sm font-semibold text-[#555] no-underline transition-colors hover:text-[#0A0A0A]"
        >
          Back to blog
        </Link>
        <header className="mb-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="font-heading rounded-full bg-[#E8E815] px-3 py-1.5 text-xs font-bold text-[#0A0A0A]">
              {post.category}
            </span>
            <span className="text-xs font-medium text-[#888]">
              {dateFormatter.format(new Date(`${post.publishedAt}T00:00:00Z`))} ·{" "}
              {post.readTime}
            </span>
          </div>
          <h1 className="font-heading mb-5 text-[clamp(40px,7vw,68px)] leading-[1.02] font-black tracking-[-0.04em] text-[#0A0A0A]">
            {post.title}
          </h1>
          <p className="text-lg leading-8 text-[#555]">{post.description}</p>
        </header>

        <div className="blog-article rounded-[28px] bg-white px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:px-10 sm:py-10">
          {post.content}
        </div>
      </article>
    </main>
  );
}
