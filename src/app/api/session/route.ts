import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("consultor_session");

  if (!token) {
    return NextResponse.json({ corretor: null });
  }

  try {
    const session = JSON.parse(token.value);
    return NextResponse.json({ corretor: session });
  } catch (err) {
    return NextResponse.json({ corretor: null });
  }
}