import { Suspense } from "react";
import { defer, type LoaderArgs } from "@remix-run/cloudflare";
import { Await, Link, useLoaderData } from "@remix-run/react";

import { getItem, getItemComments } from "~/api.server";

import { Comment } from "~/components/comment";

export async function loader({ params }: LoaderArgs) {
  if (!params.id) throw new Response(null, { status: 404 });

  let itemPromise = getItem(params.id);
  let commentsPromise = getItemComments(params.id);

  return defer(
    {
      story: await itemPromise,
      comments: commentsPromise,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}

export default function Story() {
  let { story, comments } = useLoaderData<typeof loader>();

  return (
    <div className="item-view">
      <div className="item-view-header">
        <a href={story.url} target="_blank" rel="noreferrer">
          <h1>{story.title || story.url || "unknown"}</h1>
        </a>
        {story.domain && <span className="host">({story.domain})</span>}
        <p className="meta">
          {story.score} points | by{" "}
          {story.by && <Link to={`/users/${story.by}`}>{story.by}</Link>}
          {story.timeAgo && ` ${story.timeAgo} ago`}
        </p>
      </div>
      <div className="item-view-comments">
        <p className="item-view-comments-header">
          {story.descendants
            ? story.descendants + " comments"
            : "No comments yet."}
        </p>
        <Suspense>
          <Await resolve={comments}>
            {(comments) => (
              <>
                <ul className="comment-children">
                  {comments.map((comment) => (
                    <Comment key={comment.id!} comment={comment} />
                  ))}
                </ul>
                {/* <CommentEnhancements /> */}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
