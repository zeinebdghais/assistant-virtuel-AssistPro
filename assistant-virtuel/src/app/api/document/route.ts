import { NextResponse } from "next/server";
import DocumentModel from "@/models/Document";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { filename, summary, userId } = await req.json();

    await dbConnect();

    const doc = await DocumentModel.create({
      filename,
      summary,
      userId,
      createdAt: new Date(),
    });

    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
