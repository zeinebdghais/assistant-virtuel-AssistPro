import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import NotificationModel from "@/models/notification";

import Notification from "@/models/notification";

export async function GET() {
  await dbConnect();

  const notifs = await Notification.find().sort({ date: -1 });

  return Response.json(notifs);
}

export async function PATCH() {
  await dbConnect();

  // Mettre toutes les notifications comme lues
  const result = await NotificationModel.updateMany(
    { read: false }, // seulement celles non lues
    { $set: { read: true } }
  );

  return NextResponse.json({
    message: "Toutes les notifications sont marquées comme lues ✅",
    modifiedCount: result.modifiedCount,
  });
}
