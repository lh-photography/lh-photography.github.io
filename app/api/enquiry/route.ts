const serviceOptions = new Set([
  "Assistant wedding photographer",
  "One-hour car shoot",
  "Family or property photos",
  "Something else",
]);

const allowedOrigins = new Set([
  "https://lh-photography.sebybanham.chatgpt.site",
  "https://sebsebeats.github.io",
  "https://lh-photography.github.io",
]);

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return origin && allowedOrigins.has(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : {};
}

function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return json(request, { error: "This form is not authorised to use the booking service." }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 12_000) {
    return json(request, { error: "That request is too long." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json() as Record<string, unknown>;
  } catch {
    return json(request, { error: "Please check the form and try again." }, 400);
  }

  if (textValue(payload.website, 200)) {
    return json(request, { ok: true });
  }

  const name = textValue(payload.name, 80);
  const email = textValue(payload.email, 160).toLowerCase();
  const service = textValue(payload.service, 80);
  const preferredDate = textValue(payload.preferredDate, 10);
  const location = textValue(payload.location, 120);
  const message = textValue(payload.message, 2_000);

  if (!name || !isEmail(email) || !serviceOptions.has(service) || message.length < 10) {
    return json(request, { error: "Please complete your name, email, shoot type and request." }, 400);
  }

  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    return json(request, { error: "Please choose a valid preferred date." }, 400);
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return json(request, { error: "Online requests are not available yet. Please use Instagram instead." }, 503);
  }

  const submission = {
    access_key: accessKey,
    subject: `New LH Photography request — ${service}`,
    from_name: "LH Photography website",
    name,
    email,
    service,
    preferred_date: preferredDate || "Not provided",
    location: location || "Not provided",
    message,
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(submission),
    });

    const providerBody = await response.text();
    let providerResult: { success?: unknown; message?: unknown } = {};
    try {
      providerResult = JSON.parse(providerBody) as { success?: unknown; message?: unknown };
    } catch {
      // A non-JSON response is not a confirmed delivery.
    }

    if (!response.ok || providerResult.success !== true) {
      const providerMessage = typeof providerResult.message === "string"
        ? providerResult.message
        : providerBody;
      console.error("Web3Forms rejected booking request", {
        status: response.status,
        message: providerMessage.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240),
      });
      if (response.status === 429) {
        return json(request, {
          error: "The booking service is temporarily busy. Please wait and try again later, or use Instagram.",
        }, 503);
      }
      return json(request, { error: "The request could not be delivered. Please try Instagram instead." }, 502);
    }

    return json(request, { ok: true });
  } catch {
    return json(request, { error: "The request could not be delivered. Please try Instagram instead." }, 502);
  }
}

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
