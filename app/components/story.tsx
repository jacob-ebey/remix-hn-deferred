import { Link } from "@remix-run/react";

import type { Story as StoryType } from "~/api.server";

const Story = (props: { story: StoryType }) => {
  return (
    <li className="news-item">
      <span className="score">{props.story.points}</span>
      <span className="title">
        {props.story.url && !props.story.url.startsWith("item?id=") ? (
          <>
            <a href={props.story.url} target="_blank" rel="noreferrer">
              {props.story.title}
            </a>
            <span className="host"> ({props.story.domain})</span>
          </>
        ) : (
          <Link to={`/item/${props.story.id}`}>{props.story.title}</Link>
        )}
      </span>
      <br />
      <span className="meta">
        {props.story.type !== "job" ? (
          <>
            by <Link to={`/users/${props.story.user}`}>{props.story.user}</Link>{" "}
            {props.story.time_ago} |{" "}
            <Link to={`/stories/${props.story.id}`}>
              {props.story.comments_count
                ? `${props.story.comments_count} comments`
                : "discuss"}
            </Link>
          </>
        ) : (
          <Link to={`/stories/${props.story.id}`}>{props.story.time_ago}</Link>
        )}
      </span>
      {props.story.type !== "link" && (
        <>
          {" "}
          <span className="label">{props.story.type}</span>
        </>
      )}
    </li>
  );
};

export default Story;
