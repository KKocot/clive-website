import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  if (context.site === undefined) {
    throw new Error(
      "rss.xml.ts: `site` is not configured in astro.config — required for RSS feed.",
    );
  }

  return rss({
    title: "Clive Blog",
    description:
      "Updates, deep-dives, and how-tos from the Clive project — Hive blockchain CLI/TUI wallet.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
