import { Suspense } from "react";
import { type LoaderArgs, defer } from "@remix-run/cloudflare";
import { useLoaderData, Await, Link } from "@remix-run/react";

import { getStories } from "~/api.server";
import Story from "~/components/story";

const mapStories: Record<string, string> = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
};

export async function loader({ params, request }: LoaderArgs) {
  let url = new URL(request.url);
  let page = +(url.searchParams.get("page") || 1);
  const type = params.category || "top";
  let stories = getStories(mapStories[type], page);

  if (url.searchParams.has("await")) {
    stories = (await stories) as any;
  }

  return defer(
    { type, stories, page },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}

export default function Stories() {
  let { page, type, stories } = useLoaderData<typeof loader>();

  return (
    <div className="news-view">
      <Suspense
        fallback={
          <div className="news-list-nav">
            <span className="page-link disabled" aria-disabled="true">
              {"<"} prev
            </span>
            <span>page {page}</span>

            <span className="page-link disabled" aria-disabled="true">
              more {">"}
            </span>
          </div>
        }
      >
        <Await resolve={stories}>
          {(stories) => (
            <>
              <div className="news-list-nav">
                {page > 1 ? (
                  <Link
                    className="page-link"
                    to={`/${type}?page=${page - 1}`}
                    aria-label="Previous Page"
                    prefetch="intent"
                  >
                    {"<"} prev
                  </Link>
                ) : (
                  <span className="page-link disabled" aria-disabled="true">
                    {"<"} prev
                  </span>
                )}
                <span>page {page}</span>
                {stories && stories.length >= 29 ? (
                  <Link
                    className="page-link"
                    to={`/${type}?page=${page + 1}`}
                    aria-label="Next Page"
                    prefetch="intent"
                  >
                    more {">"}
                  </Link>
                ) : (
                  <span className="page-link disabled" aria-disabled="true">
                    more {">"}
                  </span>
                )}
              </div>
              <main className="news-list">
                {stories && (
                  <ul>
                    {stories.map((story) => (
                      <Story key={story.id} story={story} />
                    ))}
                  </ul>
                )}
              </main>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
