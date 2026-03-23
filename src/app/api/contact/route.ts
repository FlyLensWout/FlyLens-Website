import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let name: unknown, email: unknown, message: unknown;
  try {
    const body = await request.json();
    name = body.name;
    email = body.email;
    message = body.message;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (typeof name !== "string" || name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be at most ${MAX_NAME_LENGTH} characters` },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  if (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be at most ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Flylens Website <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Nieuw contactbericht van ${name}`,
      replyTo: email,
      text: `Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
