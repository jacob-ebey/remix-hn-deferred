import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onError(error) {
        responseStatusCode = 500;
        console.log(error);
      },
    }
  );

  if (isbot(request.headers.get("User-Agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html; charset=utf-8");
  responseHeaders.set("Content-Encoding", "chunked");
  responseHeaders.set("Transfer-Encoding", "chunked");
  responseHeaders.set("Connection", "keep-alive");

  return new Response(body, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
