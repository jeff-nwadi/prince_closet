import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { shield, detectBot, tokenBucket, protectSignup } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

// ── Arcjet instances ──────────────────────────────────────────────────────────

// Base protection: Shield WAF + bot detection for all auth routes
const baseAj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
  ],
});

// Login: base protection + brute-force rate limiting (10 tokens, refill 5/min)
const loginAj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    tokenBucket({ mode: "LIVE", refillRate: 5, interval: "1m", capacity: 10 }),
  ],
});

// Signup: rate limiting + bot detection + disposable email blocking via protectSignup
const signupAj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: {
        mode: "LIVE",
        deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [], // block all bots
      },
      rateLimit: {
        mode: "LIVE",
        interval: "10m",
        max: 5,
      },
    }),
  ],
});

// ── Better Auth handler ───────────────────────────────────────────────────────

const authHandler = toNextJsHandler(auth);

// ── GET handler ───────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Skip Arcjet protection if key is not configured (local dev without Arcjet)
  if (!process.env.ARCJET_KEY) {
    return authHandler.GET(req);
  }

  const decision = await baseAj.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  return authHandler.GET(req);
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Skip Arcjet protection if key is not configured (local dev without Arcjet)
  if (!process.env.ARCJET_KEY) {
    return authHandler.POST(req);
  }

  const pathname = req.nextUrl.pathname;

  // ── Sign-in: brute-force protection ──
  if (pathname.includes("/sign-in/email")) {
    const decision = await loginAj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many sign-in attempts. Please wait a minute and try again." },
          { status: 429 },
        );
      }
      if (decision.reason.isBot()) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return authHandler.POST(req);
  }

  // ── Sign-up: email validation + bot + rate limit ──
  if (pathname.includes("/sign-up/email")) {
    // Parse email from request body to pass to Arcjet email validation
    let email = "";
    try {
      const cloned = req.clone();
      const body: unknown = await cloned.json();
      if (body && typeof body === "object" && "email" in body && typeof (body as { email: unknown }).email === "string") {
        email = (body as { email: string }).email;
      }
    } catch {
      // Malformed body — let Better Auth handle the error
    }

    const decision = await signupAj.protect(req, { email });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too many sign-up attempts. Please try again later." },
          { status: 429 },
        );
      }
      if (decision.reason.isEmail()) {
        return NextResponse.json(
          { error: "Please use a valid, permanent email address." },
          { status: 400 },
        );
      }
      if (decision.reason.isBot()) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return authHandler.POST(req);
  }

  // ── All other auth POST routes: base protection only ──
  const decision = await baseAj.protect(req);

  if (decision.isDenied()) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  return authHandler.POST(req);
}
