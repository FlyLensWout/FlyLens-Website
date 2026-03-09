import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
