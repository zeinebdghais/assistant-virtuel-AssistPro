import { dbConnect } from "@/lib/mongodb";
import Feedback, { IFeedback } from "@/models/feedback";
import User from "@/models/User";
import { io } from "../../../../server";
// import { Notification } from "@/types/notification";
// import NotificationModel from "@/models/notification";
import Notification from "@/models/notification";
// GET all avis
export async function GET() {
  await dbConnect();
  const feedbacks: IFeedback[] = await Feedback.find()
    .populate("userId", "nom prenom avatar role")
    .sort({ dateFeedback: -1 });
  return new Response(JSON.stringify(feedbacks), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  await dbConnect();

  const role = req.headers.get("x-user-role");
  const userId = req.headers.get("x-user-id");

  if (!role || !userId) return new Response("Unauthorized", { status: 401 });

  const user = await User.findById(userId);
  if (!user) return new Response("Utilisateur non trouvé", { status: 404 });

  if (user.role !== "employe") {
    return new Response("Interdit", { status: 403 });
  }

  const data = await req.json();
  data.userId = user._id;

  // ➕ 1. Créer le feedback
  const feedback = await Feedback.create(data);

  // ➕ 2. Construire la notification
  const notifData = {
    type: "new-feedback",
    message: `Un employé a ajouté un feedback`,
    content: data.content,
    date: new Date(),
    read: false,
  };

  // ➕ 3. Sauvegarder la notification
  const savedNotif = await Notification.create(notifData);

  // ➕ 4. Émettre en temps réel
  io.emit("admin_notification", savedNotif);

  return Response.json(feedback);
}
