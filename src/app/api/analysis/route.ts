import { NextResponse } from "next/server";

export async function GET() {
    const analysis = (global as any).lastAnalysis || [];
    return NextResponse.json(analysis);
}
