import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const publishedPosts = posts.filter((post) => !post.data.draft);

  return rss({
    title: "Clive Blog",
    description: "News, updates and tutorials about Clive — Hive blockchain CLI/TUI wallet.",
    site: context.site!,
    items: publishedPosts
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
