import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { SiweMessage } from "siwe";

export async function POST(req: Request) {
  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      return NextResponse.json({ ok: false, error: "Missing parameters" }, { status: 400 });
    }

    const siwe = new SiweMessage(message);
    const result = await siwe.verify({ signature });

    if (!result.success) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }

    const walletAddress = result.data.address.toLowerCase();

    // USER
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // CORRETOR
    let corretor = await prisma.corretor.findUnique({
      where: { userId: user.id },
    });

    if (!corretor) {
      const last = await prisma.corretor.findFirst({
        orderBy: { id: "desc" },
      });

      const nextId = (last?.id ?? 0) + 1;
      const corretorId = `BEMCR-${String(nextId).padStart(5, "0")}`;

      corretor = await prisma.corretor.create({
        data: { userId: user.id, corretorId },
      });
    }

    // SESSION COOKIE
    const token = JSON.stringify({
      userId: user.id,
      wallet: walletAddress,
      corretorId: corretor.corretorId,
    });

    const res = NextResponse.json({
      ok: true,
      corretorId: corretor.corretorId,
    });

    res.cookies.set("consultor_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}