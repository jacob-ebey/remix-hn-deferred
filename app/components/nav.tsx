import { Link } from "@remix-run/react";

function Nav() {
  return (
    <header className="header">
      <nav className="inner">
        <Link to="/" prefetch="intent">
          <strong>HN</strong>
        </Link>
        <Link to="/new" prefetch="intent">
          <strong>New</strong>
        </Link>
        <Link to="/show" prefetch="intent">
          <strong>Show</strong>
        </Link>
        <Link to="/ask" prefetch="intent">
          <strong>Ask</strong>
        </Link>
        <Link to="/job" prefetch="intent">
          <strong>Jobs</strong>
        </Link>
        <a
          className="github"
          href="https://remix.run"
          target="_blank"
          rel="noreferrer"
        >
          Built with Remix
        </a>
      </nav>
    </header>
  );
}

export default Nav;
