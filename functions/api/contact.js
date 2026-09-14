// Cloudflare Pages Function — handles POST /api/contact
//
// Same approach as the Maintenance site: no Formspree, no third-party form
// dashboard. This runs on Cloudflare's own infrastructure (free, same place
// the site is hosted) and sends the enquiry by email using Resend
// (https://resend.com — free tier covers 100 emails/day / 3,000/month).
//
// One-time setup required before this works:
//   1. Sign up at resend.com (free) — or reuse the same account already set
//      up for the Maintenance site.
//   2. Add and verify goodmanagement.co.uk as a sending domain (Resend gives
//      you a few DNS records to add).
//   3. Create an API key in Resend (a separate one per site is fine, or
//      reuse the same key if both domains are verified on one account).
//   4. In this Cloudflare Pages project: Settings → Environment variables →
//      add RESEND_API_KEY (as a secret) with that key.
//   5. Optional: add CONTACT_TO / CONTACT_FROM as environment variables if
//      you want to change the destination or from-address without editing
//      code.
//
// Until RESEND_API_KEY is set, submissions will fail gracefully (visitor is
// sent back to the contact page with an error note) rather than silently
// disappearing.
//
// Note: the launch guide's condition on this site (company number and
// registered office filled in before going live) is now satisfied — the
// footer and privacy page carry TGMC's real details as of September 2026.

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);

  let data;
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }
  } catch (err) {
    return Response.redirect(new URL("/contact.html?error=invalid", url), 303);
  }

  // Honeypot — the "website" field is hidden from real visitors via CSS.
  // Bots fill in every field they find. If it's filled, pretend success and
  // do nothing else, so the bot has no way to tell it was caught.
  if (data.website) {
    return Response.redirect(new URL("/thank-you.html", url), 303);
  }

  const email = (data.email || "").toString().trim();
  const subject = (data.subject || "").toString().trim();
  const message = (data.message || "").toString().trim();

  if (!email || !subject || !message) {
    return Response.redirect(new URL("/contact.html?error=missing", url), 303);
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured for this Pages project.");
    return Response.redirect(new URL("/contact.html?error=config", url), 303);
  }

  const toAddress = env.CONTACT_TO || "team@goodmanagement.co.uk";
  const fromAddress = env.CONTACT_FROM || "Website <contact@goodmanagement.co.uk>";

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: email,
        subject: `Website enquiry: ${subject}`,
        text: `From: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Resend API error:", await emailResponse.text());
      return Response.redirect(new URL("/contact.html?error=send", url), 303);
    }
  } catch (err) {
    console.error("Error calling Resend:", err);
    return Response.redirect(new URL("/contact.html?error=send", url), 303);
  }

  return Response.redirect(new URL("/thank-you.html", url), 303);
}

// A GET request to /api/contact isn't a real submission — send visitors back
// to the contact page instead of showing raw JSON or an error.
export async function onRequestGet({ request }) {
  return Response.redirect(new URL("/contact.html", request.url), 303);
}
