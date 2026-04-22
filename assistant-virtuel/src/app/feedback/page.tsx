"use client";
import { useEffect, useState } from "react";
import { Star, MoreVertical, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { FeedbackDialog } from "./components/dialog";
import { FeedbackEditDialog } from "./components/FeedbackEditDialog";
import { DeleteAlertDialog } from "./components/DeleteAlertDialog";

interface UserDetails {
  nom: string;
  prenom: string;
  avatar?: string;
  _id?: string;
}

interface Feedback {
  _id: string;
  content: string;
  note: number;
  dateFeedback: string;
  userId?: UserDetails;
  status: "Examiné" | "En attente";
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [user, setUser] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      fetchUserFeedbacks(parsedUser.id);
    }
  }, []);

  const fetchUserFeedbacks = async (userId: string) => {
    try {
      const res = await fetch(`/api/feedback/${userId}`);
      if (!res.ok) throw new Error("Erreur récupération feedbacks");
      const data: Feedback[] = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression feedback");
      if (user) fetchUserFeedbacks(user.id);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(".", "");
  };

  const renderStars = (note: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={cn(
            i <= note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );

  const filteredFeedbacks = feedbacks.filter((f) => {
    const term = search.toLowerCase();
    const content = f.content ? f.content.toLowerCase() : "";
    const nom = f.userId?.nom ? f.userId.nom.toLowerCase() : "";
    const prenom = f.userId?.prenom ? f.userId.prenom.toLowerCase() : "";
    return (
      content.includes(term) || nom.includes(term) || prenom.includes(term)
    );
  });

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            {/* <Clock className="w-6 h-6 text-gray-700" /> */}
            <div>
              <h1 className="text-3xl font-semibold flex items-center gap-2 mb-1 text-gray-800">
                <MessageSquare className="w-6 h-6 text-orange-400" />
                Vos Feedbacks
              </h1>
              <p className="text-gray-500 text-sm">
                Consultez et gérez vos avis récents
              </p>
            </div>
          </div>
          <FeedbackDialog
            onFeedbackAdded={() => user && fetchUserFeedbacks(user.id)}
          />
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <Input
            placeholder="Rechercher un feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2"
          />
        </div>

        {/* Tableau des feedbacks */}
        {filteredFeedbacks.length === 0 ? (
          <p className="text-gray-400 mt-10 text-center">Aucun avis trouvé.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-xl shadow-lg border p-4 w-full bg-white">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60%] text-gray-600 font-medium py-4">
                        Feedback
                      </TableHead>
                      <TableHead className="w-[15%] text-gray-600 font-medium py-4">
                        Note
                      </TableHead>
                      <TableHead className="w-[10%] text-gray-600 font-medium py-4">
                        Date
                      </TableHead>
                      <TableHead className="w-[15%] text-gray-600 font-medium text-center py-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.map((fb) => (
                      <TableRow
                        key={fb._id}
                        className="hover:bg-gray-50 transition-all min-h-[70px]"
                      >
                        <TableCell className="max-w-md text-sm text-gray-700 py-4">
                          <p className="line-clamp-2">{fb.content}</p>
                          {fb.userId && (
                            <p className="text-xs text-gray-400 mt-1">
                              {fb.userId.nom} {fb.userId.prenom}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {renderStars(fb.note)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 py-4">
                          {formatDate(fb.dateFeedback)}
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="w-5 h-5 cursor-pointer text-gray-400 hover:text-indigo-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => setOpenEdit(fb._id)}
                              >
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setOpenDelete(fb._id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        {/* Dialogues */}
                        <FeedbackEditDialog
                          feedback={{
                            _id: fb._id,
                            content: fb.content,
                            note: fb.note,
                          }}
                          open={openEdit === fb._id}
                          setOpen={(val) => !val && setOpenEdit(null)}
                          onFeedbackUpdated={() =>
                            user && fetchUserFeedbacks(user.id)
                          }
                        />
                        <DeleteAlertDialog
                          open={openDelete === fb._id}
                          setOpen={(val) => !val && setOpenDelete(null)}
                          onConfirm={() => handleDeleteConfirm(fb._id)}
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
