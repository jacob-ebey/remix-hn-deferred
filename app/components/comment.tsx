import { useState } from "react";
import { Link } from "@remix-run/react";
import cn from "clsx";

import type { Comment as CommentType } from "~/api.server";

const pluralize = (n: number) => n + (n === 1 ? " reply" : " replies");

export function Comment(props: { comment: CommentType }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleComment = () => setCollapsed(!collapsed);

  return (
    <li className="comment">
      <div className="by">
        <Link to={`/users/${props.comment.user}`}>{props.comment.user}</Link>{" "}
        {props.comment.time_ago} ago
      </div>
      <div
        className="text"
        dangerouslySetInnerHTML={{ __html: props.comment.content || "" }}
      />
      {props.comment.comments?.length && (
        <>
          <div className={cn("toggle", !collapsed && "open")}>
            <button data-cc={props.comment.id} onClick={toggleComment}>
              [-]
            </button>
            <button data-ce={props.comment.id} onClick={toggleComment}>
              [+] {pluralize(props.comment.comments.length) + " collapsed"}
            </button>
          </div>
          <ul
            style={{ display: collapsed ? "none" : undefined }}
            className="comment-children"
            data-cs={props.comment.id}
          >
            {props.comment.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

// const js = String.raw;
// export const CommentEnhancements = () => {
//   return (
//     <script
//       dangerouslySetInnerHTML={{
//         __html: js`
//           document.addEventListener("click", (event) => {
//             let classList = event.target.parentElement.classList;
//             if (!classList) return;

//             let id = event.target.getAttribute("data-cc");
//             if (id) {
//               let el = document.querySelector("[data-cs='" + id + "']");
//               if (el) el.style.display = "none";
//               classList.remove("open");
//               return;
//             }
//             id = event.target.getAttribute("data-ce");
//             if (id) {
//               let el = document.querySelector("[data-cs='" + id + "']");
//               if (el) el.style.display = "block";
//               classList.add("open");
//             }
//           })
//         `,
//       }}
//     />
//   );
// };
