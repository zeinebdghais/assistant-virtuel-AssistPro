import { dbConnect } from "@/lib/mongodb";
import Feedback, { IFeedback } from "@/models/feedback";
import { io } from "../../../../../server";
// import { Notification } from "@/types/notification";
import Notification from "@/models/notification";

// GET one product
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();

  const feedbacks = await Feedback.find({ userId: id }).sort({
    dateFeedback: -1,
  });

  return Response.json(feedbacks);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();
  const data = await req.json();
  const feedback: IFeedback | null = await Feedback.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );
  if (feedback) {
    const notifData = {
      type: "update-feedback",
      message: `Un feedback a été modifié`,
      content: feedback.content,
      date: new Date(),
      read: false,
    };
    const savedNotif = await Notification.create(notifData);
    io.emit("admin_notification", savedNotif);
  }

  return Response.json(feedback);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();
  const deletedFeedback = await Feedback.findByIdAndDelete(id);
  if (deletedFeedback) {
    const notifData = {
      type: "delete-feedback",
      message: "Un feedback a été supprimé",
      content: deletedFeedback.content,
      date: new Date(),
      read: false,
    };
    const savedNotif = await Notification.create(notifData);

    io.emit("admin_notification", savedNotif);
  }

  return Response.json({ message: "Avis supprimé ✅" });
}
