import { NextRequest, NextResponse } from "next/server";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const FILENAME_REGEX = /^[a-zA-Z0-9_-]+\.mp4$/;

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("file");

  if (!fileName || !FILENAME_REGEX.test(fileName)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  if (!R2_PUBLIC_URL) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const r2Url = `${R2_PUBLIC_URL}/${fileName}`;
  const range = request.headers.get("range");

  const headers: HeadersInit = {};
  if (range) {
    headers["Range"] = range;
  }

  const r2Response = await fetch(r2Url, { headers });

  if (!r2Response.ok && r2Response.status !== 206) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "video/mp4");
  responseHeaders.set("Accept-Ranges", "bytes");
  responseHeaders.set("Cache-Control", "private, no-store");
  responseHeaders.set("Content-Disposition", "inline");
  responseHeaders.set("X-Content-Type-Options", "nosniff");

  const contentLength = r2Response.headers.get("content-length");
  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  const contentRange = r2Response.headers.get("content-range");
  if (contentRange) {
    responseHeaders.set("Content-Range", contentRange);
  }

  return new NextResponse(r2Response.body, {
    status: r2Response.status,
    headers: responseHeaders,
  });
}
