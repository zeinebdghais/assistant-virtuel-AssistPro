import { createServer } from "http";
import { Server, Socket } from "socket.io";
// Création du serveur HTTP
const httpServer = createServer();

export const io =
  (global as any)._io ||
  new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

//  Fonction pour envoyer une notification aux admins
export function sendMissingAnswerNotification(question: string, employeeId?: string) {
  const payload = {
    type: "missing-answer", 
    message: "Une question n'a pas de réponse",
    content: question,
    employeeId: employeeId || null,
    date: new Date(),
    read: false,
  };

  console.log("📢 Notification admin envoyée :", payload);
  io.to("admins").emit("admin_notification", payload);

}

if (!(global as any)._io) {
  (global as any)._io = io;

  io.on("connection", (socket: Socket) => {
    console.log("🟢 Client connecté :", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client déconnecté :", socket.id);
    });
  });

  httpServer.listen(3001, () => {
    console.log("🚀 WebSocket server running on port 3001");
  });
}
