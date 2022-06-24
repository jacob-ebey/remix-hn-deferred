import type { IItem } from "hacker-news-api-types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
const cache = (caches as any).default as Cache;

export interface Comment {
  id?: number;
  level?: number;
  user?: string;
  time?: number;
  time_ago?: string;
  content?: string;
  comments?: Comment[];
}

export interface Story {
  id?: number;
  title?: string;
  points?: number | null;
  user?: null | string;
  time?: number;
  time_ago?: string;
  comments_count?: number;
  type?: string;
  url?: string;
  domain?: string;
}

export interface Item extends IItem {
  domain?: string;
  timeAgo?: string;
}

function cachedFetch(request: Request | string) {
  return cache.match(request).then((response) => {
    if (response) {
      return response;
    }
    return fetch(request).then(async (response) => {
      if (!response.ok) {
        throw new Response(response.statusText, { status: response.status });
      }
      const cloned = response.clone();
      const cacheHeaders = new Headers(cloned.headers);
      cacheHeaders.append("Cache-Control", "public, max-age=60");
      const toCache = new Response(cloned.body, {
        headers: cacheHeaders,
        status: cloned.status,
        statusText: cloned.statusText,
      });
      await cache.put(request, toCache);
      return response;
    });
  });
}

export async function getStories(
  category: string,
  page: number | string
): Promise<Story[]> {
  const response = await cachedFetch(
    `https://node-hnapi.herokuapp.com/${category}?page=${page}`
  );
  const data = await response.json<Story[]>();

  return data;
}

export async function getItem(id: string | number): Promise<Item> {
  const response = await cachedFetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  const data = await response.json<Item>();

  const domain = data.url ? new URL(data.url).hostname : undefined;

  return {
    ...data,
    domain,
    timeAgo:
      typeof data.time === "number"
        ? (timeAgo.format(data.time!) as string)
        : undefined,
  };
}

export async function getItemComments(id: string | number): Promise<Comment[]> {
  const response = await fetch(`https://node-hnapi.herokuapp.com/item/${id}`);
  const data = await response.json<{ comments: Comment[] }>();

  return data.comments;
}
