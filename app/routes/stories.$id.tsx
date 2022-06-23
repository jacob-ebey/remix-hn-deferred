import type { Deferrable, LoaderFunction } from "@remix-run/cloudflare";
import { deferred } from "@remix-run/cloudflare";
import { Deferred, Link, useLoaderData } from "@remix-run/react";

import type { Item, Comment as CommentType } from "~/api.server";
import { getItem, getItemComments } from "~/api.server";

import { Comment, CommentEnhancements } from "~/components/comment";

type LoaderData = {
  story: Item;
  comments: Deferrable<CommentType[]>;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id) throw new Response(null, { status: 404 });

  let itemPromise = getItem(params.id);
  let commentsPromise = getItemComments(params.id);

  return deferred<LoaderData>({
    story: await itemPromise,
    comments: commentsPromise,
  });
};

export default function Story() {
  let { story, comments } = useLoaderData<LoaderData>();

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
        <Deferred value={comments}>
          {(comments) => (
            <>
              <ul className="comment-children">
                {comments.map((comment) => (
                  <Comment key={comment.id!} comment={comment} />
                ))}
              </ul>
              <CommentEnhancements />
            </>
          )}
        </Deferred>
      </div>
    </div>
  );
}
