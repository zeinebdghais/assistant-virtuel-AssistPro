"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Star, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserType {
  nom: string;
  prenom: string;
  role: string;
  email?: string;
}

interface Feedback {
  _id: string;
  content: string;
  note: number;
  dateFeedback: string;
  userId?: UserType | null;
}

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch dynamique depuis l'API ---
  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch("/api/feedback");
        if (res.ok) {
          const data: Feedback[] = await res.json();
          setFeedbacks(data);
        } else {
          console.error(
            "Erreur lors de la récupération des feedbacks depuis l'API"
          );
        }
      } catch (error) {
        console.error("Erreur réseau lors du fetch des feedbacks:", error);
      }
    }
    fetchFeedbacks();
  }, []);

  // --- Filtrage par recherche ---
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.userId?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.userId?.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Calcul des stats dynamiques ---
  const totalFeedbacks = feedbacks.length;
  const averageNote =
    totalFeedbacks > 0
      ? (
          feedbacks.reduce((acc, f) => acc + f.note, 0) / totalFeedbacks
        ).toFixed(1)
      : "0";
  const fiveStarCount = feedbacks.filter((f) => f.note === 5).length;

  const statsDesign = [
    { label: "Total feedbacks", value: totalFeedbacks },
    { label: "Note moyenne", value: averageNote },
    { label: "5 étoiles", value: fiveStarCount },
  ];

  // --- Fonctions utilitaires ---
  const renderStars = (note: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= note ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const formatTableDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(".", "");
  };

  return (
    <div className="p-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold flex items-center gap-2 mb-1 text-gray-800">
          <MessageSquare className="w-6 h-6 text-orange-400" />
          Gestion des feedbacks
        </h1>
        <p className="text-gray-600 text-sm">
          Consultez et analysez les retours de vos employés
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        {statsDesign.map((stat) => (
          <Card
            key={stat.label}
            className="shadow-md hover:shadow-lg transition text-center"
          >
            <CardContent className="p-4">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="relative grow max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un feedback..."
            className="pl-10 h-10 border-gray-300 focus:border-blue-500 rounded-lg"
          />
        </div>
      </motion.div>

      {/* Table Feedbacks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-xl shadow-sm border p-2 w-full">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%] text-gray-500 font-medium">
                    Employé
                  </TableHead>
                  <TableHead className="w-[45%] text-gray-500 font-medium">
                    Feedback
                  </TableHead>
                  <TableHead className="w-[10%] text-gray-500 font-medium">
                    Note
                  </TableHead>
                  <TableHead className="w-[15%] text-gray-500 font-medium">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback._id} className="hover:bg-gray-100">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50/70 border border-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {feedback.userId
                              ? `${feedback.userId.prenom} ${feedback.userId.nom}`
                              : "Utilisateur supprimé"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feedback.userId
                              ? feedback.userId.email ||
                                `Rôle: ${feedback.userId.role}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md text-sm text-gray-700">
                      <p className="line-clamp-2">{feedback.content}</p>
                    </TableCell>
                    <TableCell>{renderStars(feedback.note)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatTableDate(feedback.dateFeedback)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
