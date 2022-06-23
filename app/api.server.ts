import type { IItem } from "hacker-news-api-types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

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

export async function getStories(
  category: string,
  page: number | string
): Promise<Story[]> {
  const response = await fetch(
    `https://node-hnapi.herokuapp.com/${category}?page=${page}`
  );
  const data = await response.json<Story[]>();

  return data;
}

export async function getItem(id: string | number): Promise<Item> {
  const response = await fetch(
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
