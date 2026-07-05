import type { ReactNode } from "react";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://calendarito.app";

export const calendaritoChromeUrl =
  "https://chromewebstore.google.com/detail/calendarito/cplhjngmdbaicnjhfdoohhjaiahbfflb?utm_campaign=EN&utm_medium=button&utm_source=landing_v2";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  content: ReactNode;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-we-built-calendarito",
    title: "Why we built Calendarito",
    description:
      "The story behind Calendarito: turning schedule PDFs, images, and quick meeting notes into Google Calendar events.",
    excerpt:
      "Calendarito started with university schedules trapped in PDFs and images. It grew into a faster way to send almost any event source to Google Calendar.",
    category: "Story",
    publishedAt: "2026-07-05",
    updatedAt: "2026-07-05",
    readTime: "3 min read",
    content: (
      <>
        <p>
          {
            "Calendarito started with a very specific university problem: schedules were sent as PDFs or images, and every class had to be copied into Google Calendar by hand."
          }
        </p>
        <p>
          {
            "That sounds small until you do it for a real semester. You zoom into a screenshot, check every day and time, create one event, repeat it, fix the recurrence, add the location, and then do it again for the next class. It is tedious enough that many people simply stop maintaining their calendar."
          }
        </p>
        <h2>From screenshots to calendar events</h2>
        <p>
          {
            "The first version of Calendarito was built around that friction. Instead of manually translating a timetable into events, you could pass the photo, PDF, or file to Calendarito and let it extract the structure for you."
          }
        </p>
        <p>
          {
            "The goal was not to make scheduling feel fancy. The goal was to remove the annoying middle step between receiving a schedule and actually having it in Google Calendar."
          }
        </p>
        <h2>The second use case: fast meeting capture</h2>
        <p>
          {
            "Once the flow worked for university schedules, another pattern became obvious. Many people do not only receive schedules as files. They also create small meetings all day from chats, calls, and quick decisions."
          }
        </p>
        <p>
          {
            "Sometimes you do not want to open Calendar, click through date fields, and fill out a form. You just want to type something like:"
          }
        </p>
        <blockquote>
          <p>{"Sync with Fausto tomorrow 9am"}</p>
        </blockquote>
        <p>
          {
            "Calendarito turns that kind of sentence into a calendar-ready event. It is useful for follow-ups, quick calls, study sessions, office hours, reminders, and all the little commitments that are easy to forget when they stay buried in a conversation."
          }
        </p>
        <h2>What Calendarito is for</h2>
        <p>
          {
            "Calendarito is for the moments when the event information already exists, but not in the place where you need it. A schedule image, a PDF, a pasted message, or a short instruction can all become structured events you can review and add to Google Calendar."
          }
        </p>
        <p>
          {
            "That is the product: less copying, fewer missed details, and a faster path from source material to calendar."
          }
        </p>
        <p>
          <a href={calendaritoChromeUrl} target="_blank" rel="noopener noreferrer">
            Add Calendarito to Google Chrome
          </a>{" "}
          or{" "}
          <a href="/get-started">
            try it on the web
          </a>
          .
        </p>
      </>
    ),
  },
  {
    slug: "best-chrome-extensions-2026",
    title: "Best Chrome Extensions in 2026",
    description:
      "A practical list of useful Chrome extensions for focus, writing, security, scheduling, tab control, and privacy in 2026.",
    excerpt:
      "A practical 2026 shortlist of Chrome extensions that reduce friction: writing help, password safety, focus, tabs, scheduling, and a promising WhatsApp privacy bonus.",
    category: "Extensions",
    publishedAt: "2026-07-05",
    updatedAt: "2026-07-05",
    readTime: "6 min read",
    content: (
      <>
        <p>
          {
            "The best Chrome extensions in 2026 are not the ones that add the most buttons to your browser. They are the ones that quietly remove friction from work you already do every day."
          }
        </p>
        <p>
          {
            "This list focuses on practical extensions for writing, focus, scheduling, security, tab cleanup, and privacy."
          }
        </p>
        <h2>1. Calendarito</h2>
        <p>
          {
            "Calendarito helps you create Google Calendar events from natural language, files, PDFs, and images. It is especially useful when someone sends a timetable, screenshot, event flyer, or quick meeting note and you want it in your calendar without manually filling out every field."
          }
        </p>
        <p>
          <a href={calendaritoChromeUrl} target="_blank" rel="noopener noreferrer">
            Add Calendarito to Google Chrome
          </a>
          .
        </p>
        <h2>2. Todoist</h2>
        <p>
          {
            "Todoist is still a strong task manager for people who want quick capture, recurring tasks, labels, filters, and lightweight project organization. The Chrome extension is useful because it lets you save a page as a task or capture a task without switching context."
          }
        </p>
        <h2>3. Bitwarden</h2>
        <p>
          {
            "Bitwarden is a solid password manager for individuals and teams. A password manager extension matters because login security should be fast enough that people actually use strong, unique passwords everywhere."
          }
        </p>
        <h2>4. 1Password</h2>
        <p>
          {
            "1Password is another excellent password manager, especially for teams and families that want polished sharing, passkeys, secure notes, and strong account recovery flows."
          }
        </p>
        <h2>5. Grammarly</h2>
        <p>
          {
            "Grammarly remains useful for emails, docs, support replies, and social posts. The best use case is not outsourcing your voice; it is catching avoidable mistakes and tightening sentences before you send them."
          }
        </p>
        <h2>6. Notion Web Clipper</h2>
        <p>
          {
            "Notion Web Clipper is helpful if your research, notes, or project planning already lives in Notion. It lets you save articles, references, and ideas into a workspace instead of leaving everything scattered across bookmarks."
          }
        </p>
        <h2>7. OneTab</h2>
        <p>
          {
            "OneTab is a simple fix for tab overload. When a window gets messy, it collapses open tabs into a list so you can recover attention without losing the pages you meant to revisit."
          }
        </p>
        <h2>8. Dark Reader</h2>
        <p>
          {
            "Dark Reader gives sites a configurable dark mode. It is useful for people who spend long days in the browser and want less visual strain across sites that do not offer their own dark theme."
          }
        </p>
        <h2>9. uBlock Origin Lite</h2>
        <p>
          {
            "uBlock Origin Lite is a Manifest V3-friendly content blocker. For many users, fewer trackers, popups, and visual interruptions make the browser feel calmer and faster."
          }
        </p>
        <h2>10. Vimium</h2>
        <p>
          {
            "Vimium adds keyboard navigation to Chrome. It is not for everyone, but it is excellent if you prefer opening links, switching pages, and moving through the browser without constantly reaching for the mouse."
          }
        </p>
        <h2>Bonus: Tabu</h2>
        <p>
          {
            "Tabu is a promising Chrome extension for people who use WhatsApp Web in public places, offices, classrooms, or shared screens. It blurs WhatsApp Web and reveals only the part of the interface you are actively using."
          }
        </p>
        <p>
          Visit{" "}
          <a href="https://www.whatsappblur.com/" target="_blank" rel="noopener noreferrer">
            Tabu
          </a>{" "}
          or install it from the{" "}
          <a
            href="https://chromewebstore.google.com/detail/tabu-whatsapp-web-blur/efohcojagphmelininkpcomoiamhidhl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome Web Store
          </a>
          .
        </p>
        <h2>How to choose</h2>
        <p>
          {
            "Keep your browser stack small. Start with one extension for each real problem: scheduling, passwords, writing, focus, tabs, and privacy. If an extension does not save time or reduce risk every week, remove it."
          }
        </p>
      </>
    ),
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostUrl(post: BlogPost) {
  return `${siteUrl}/blog/${post.slug}`;
}
