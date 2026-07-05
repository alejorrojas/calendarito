import type { MetadataRoute } from "next";
import { blogPosts, siteUrl } from "./blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/how-it-works", "/blog", "/privacy", "/terms"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-07-05"),
    }),
  );

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }));

  return [...staticRoutes, ...blogRoutes];
}
