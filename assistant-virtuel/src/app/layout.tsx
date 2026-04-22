"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Home,
  PieChart,
  Users,
  BookOpen,
  MessageSquare,
  Bell,
  Bot,
} from "lucide-react";
import { LinkItem } from "@/types/LinkItem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tous les liens avec icône
export const allLinks: LinkItem[] = [
  { name: "Accueil", href: "/home", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: PieChart },
  { name: "Gestion des employés", href: "/employees", icon: Users },
  { name: "Assistant Virtuel", href: "/chat", icon: Bot },
  { name: "FAQ", href: "/faq", icon: BookOpen },
  { name: "Avis", href: "/feedback", icon: MessageSquare },

  { name: "Feedbacks", href: "/admin_feedback", icon: MessageSquare },
  { name: "Notifications", href: "/notif/admin", icon: Bell },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" || pathname === "/register" || pathname === "/";

  const [links, setLinks] = useState<LinkItem[]>([]);

  // Fonction pour charger les liens selon le rôle
  const updateLinks = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);
    const role = user.role?.toLowerCase().trim();

    let filteredLinks: LinkItem[] = allLinks.filter(
      (l) => l.name === "Accueil"
    );

    if (role === "admin") {
      filteredLinks = allLinks.filter((link) =>
        [
          "Dashboard",
          "Gestion des employés",
          "Feedbacks",
          "Notifications",
        ].includes(link.name)
      );
    } else if (role === "employe") {
      filteredLinks = allLinks.filter((link) =>
        ["Accueil", "Assistant Virtuel", "FAQ", "Avis"].includes(link.name)
      );
    }

    setLinks(filteredLinks);
  };

  // Charger les liens à l'initialisation et à chaque changement de pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateLinks();
    }
  }, [pathname]);

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!hideNavbar && links.length > 0 ? (
          <Navbar links={links}>
            <SidebarInset>{children}</SidebarInset>
          </Navbar>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
