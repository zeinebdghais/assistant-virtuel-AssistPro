"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { Notification as INotification } from "@/types/notification";

import {
  Bell,
  AlertCircle,
  Info,
  Calendar,
  MoreVertical,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeConfig = {
  "new-feedback": {
    icon: Info,
    color: "bg-blue-50 text-blue-500",
    badgeClass: "bg-blue-500 text-white",
    // label: "Information",
    borderColor: "border-blue-500",
  },
  "update-feedback": {
    icon: Calendar,
    color: "bg-orange-50 text-orange-500",
    badgeClass: "bg-orange-500 text-white",
    // label: "Rappel",
    borderColor: "border-orange-500",
  },
  "delete-feedback": {
    icon: AlertCircle,
    color: "bg-red-50 text-red-500",
    badgeClass: "bg-red-500 text-white",
    // label: "Important",
    borderColor: "border-red-500",
  },
};

// --- Composant Principal ---
export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<
    (INotification & { read: boolean; id: string })[]
  >([]);

  // Connexion Socket.IO
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
    const socket: Socket = io("http://localhost:3001"); // Port de ton server.ts

    socket.on("connect", () => console.log("🟢 Admin connecté au WebSocket"));

    socket.on("admin_notification", (notif: INotification) => {
      const newNotif = {
        ...notif,
        read: false,
        id: crypto.randomUUID(),
      };

      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Compteur notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    try {
      // Appel API pour tout marquer comme lu
      const res = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (!res.ok)
        throw new Error("Erreur lors de la mise à jour des notifications");

      // Mise à jour locale pour UI
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications :", error);
    }
  };

  // Supprimer notification
  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications
            <Badge className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          </h1>

          <Button
            variant="outline"
            className="text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={handleMarkAllAsRead}
          >
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
        <p className="text-gray-600">
          Restez informé des derniers feedbacks des employés
        </p>
      </motion.div>

      {/* Liste Notifications */}
      <div className="space-y-4">
        {notifications.map((notif, index) => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={notif.id || `notif-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`shadow-lg border-l-4 ${config.borderColor} transition-shadow`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 grow">
                    <div
                      className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center shrink-0 border border-current`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-semibold text-base ${
                            notif.read ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          notif.read ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {notif.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.date).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* <Badge
                      className={`${config.badgeClass} rounded-full font-medium px-3 py-1`}
                    >
                      {config.label}
                    </Badge> */}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700"
                          onClick={() => handleDelete(notif.id)}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
