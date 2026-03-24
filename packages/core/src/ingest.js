import { load } from "cheerio";
import Parser from "rss-parser";
import { extractTweetIdFromUrl, getPost, getUserByUsername, getUserPosts } from "./clients/x";
import { getEnv } from "./env";
const rssParser = new Parser();
export async function extractTextFromHtml(html) {
    const $ = load(html);
    $("script,style,noscript").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
}
export async function ingestUrlSource(url) {
    const response = await fetch(url);
    const html = await response.text();
    const text = await extractTextFromHtml(html);
    return [
        {
            title: url,
            rawText: text.slice(0, 10_000),
            metadata: {}
        }
    ];
}
export async function ingestRssSource(url) {
    const feed = await rssParser.parseURL(url);
    return feed.items.slice(0, 5).map((item) => ({
        title: item.title ?? url,
        rawText: [item.contentSnippet, item.content, item.summary].filter(Boolean).join("\n\n").slice(0, 10_000),
        metadata: {
            link: item.link ?? null,
            isoDate: item.isoDate ?? null
        }
    }));
}
export async function ingestXPostSource(url) {
    const tweetId = extractTweetIdFromUrl(url);
    const env = getEnv();
    if (!tweetId || !env.X_BEARER_TOKEN) {
        throw new Error("X post source requires a valid post URL and X_BEARER_TOKEN.");
    }
    const response = await getPost({
        authToken: env.X_BEARER_TOKEN,
        tweetId
    });
    const data = response.data.data;
    if (!data?.text) {
        throw new Error("Unable to load X post content.");
    }
    return [
        {
            title: `X post ${data.id ?? tweetId}`,
            rawText: data.text,
            metadata: response.data
        }
    ];
}
export async function ingestXAccountSource(username) {
    const env = getEnv();
    if (!env.X_BEARER_TOKEN) {
        throw new Error("X_BEARER_TOKEN is required for X account ingestion.");
    }
    const userResponse = await getUserByUsername(username);
    const userId = userResponse.data?.id;
    if (!userId) {
        throw new Error(`Unable to resolve X account @${username}`);
    }
    const posts = await getUserPosts({
        authToken: env.X_BEARER_TOKEN,
        userId
    });
    const data = posts.data.data ?? [];
    return data.map((post) => ({
        title: `@${username} post ${post.id ?? ""}`.trim(),
        rawText: post.text ?? "",
        metadata: post
    }));
}
