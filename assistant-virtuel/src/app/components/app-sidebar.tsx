"use client";

import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import {
  Home,
  PieChart,
  Users,
  Bot,
  User,
  LogOut,
  CircleQuestionMark,
  Star,
  MessageCircle,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LinkItem } from "@/types/LinkItem";

export function AppSidebar({ links }: { links: LinkItem[] }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    // Chargement initial
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      });

    // Socket temps réel
    const socket: Socket = io("http://localhost:3001");

    socket.on("admin_notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    Accueil: Home,
    Dashboard: PieChart,
    "Gestion des employés": Users,
    FAQ: CircleQuestionMark,
    Avis: Star,
    "Assistant Virtuel": MessageCircle,
    Feedbacks: Star,
    Notifications: Bell,
  };

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between z-50">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-linear-to-r from-blue-600 to-emerald-500 shadow-l rounded-2xl mr-3">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              AssistPro
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition relative ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  {Icon && <Icon size={18} />}

                  {link.name === "Notifications" && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profil utilisateur */}
        {user && (
          <div className="px-6 py-6 border-t">
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-lg font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="mt-5 w-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 rounded-lg border hover:bg-red-100 hover:text-red-700 hover:shadow-sm transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}
      </aside>
      <div className="ml-64">{/* tout le contenu des pages ira ici */}</div>
    </>
  );
}
