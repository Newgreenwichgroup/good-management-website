// Cloudflare Worker entry point — routes /api/contact to the contact-form
// handler below, and serves every other request as a normal static page.
//
// Same logic as functions/api/contact.js (that file is no longer used once
// this one exists, but is left in place as a reference — it's excluded from
// the live site by .assetsignore so it isn't publicly visible).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method === "POST") {
        return handleContactPost(request, env, url);
      }
      if (request.method === "GET") {
        return Response.redirect(new URL("/contact.html", url), 303);
      }
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContactPost(request, env, url) {
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
    console.error("RESEND_API_KEY is not configured for this project.");
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
