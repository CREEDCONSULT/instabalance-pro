import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json([], { status: 401 });

    const session = await db.importSession.findFirst({
        where: { user: { clerkId } },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(session?.rawData || []);
}
