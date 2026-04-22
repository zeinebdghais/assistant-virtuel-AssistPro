"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Mail,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddUserDialog from "./components/AddUserDialog";
import EditUserDialog from "./components/EditUserDialog";

interface User {
  _id: string;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  role: string;
  numTelephone: string;
  poste: string;
  salaire: number;
  dateEmbauche: string;
}

export default function AdminUsers() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [employes, setEmployes] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    username: "",
    role: "employe",
    numTelephone: "",
    poste: "",
    salaire: 0,
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role);

      if (decoded.role === "admin") {
        fetch("/Gestionusers")
          .then((res) => res.json())
          .then((data) => {
            const onlyEmployees = data.filter(
              (user: User) => user.role === "employe"
            );
            setEmployes(onlyEmployees);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  // Filtrage
  const filteredUsers = employes.filter((u) =>
    `${u.nom} ${u.prenom} ${u.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/Gestionusers/${selectedUser._id}`, {
        method: "PUT", // ou PATCH selon ton API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      if (res.ok) {
        await refreshUsers();
        setIsEditDialogOpen(false);
        alert("Utilisateur modifié !");
      } else alert("Erreur lors de la modification.");
    } catch {
      alert("Erreur serveur.");
    }
  };

  // SUPPRESSION
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Supprimer cet employé ?")) return;

    try {
      const res = await fetch(`/Gestionusers/${id}`, { method: "DELETE" });

      if (res.ok) {
        setEmployes((prev) => prev.filter((e) => e._id !== id));
        alert("Employé supprimé !");
      } else alert("Erreur lors de la suppression.");
    } catch {
      alert("Erreur serveur.");
    }
  };

  const refreshUsers = async () => {
    const res = await fetch("/Gestionusers");
    const data = await res.json();
    const onlyEmployees = data.filter((u: User) => u.role === "employe");
    setEmployes(onlyEmployees);
  };

  // AJOUT
  const handleAddUser = async () => {
    try {
      const res = await fetch("/Gestionusers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const created = await res.json();
        await refreshUsers();

        setIsAddDialogOpen(false);

        setNewUser({
          nom: "",
          prenom: "",
          email: "",
          username: "",
          password: "",
          role: "employe",
          numTelephone: "",
          poste: "",
          salaire: 0,
        });

        alert("Utilisateur ajouté !");
      } else alert("Erreur lors de l'ajout.");
    } catch {
      alert("Erreur serveur.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );

  // ---------------------------
  // ACCES REFUSÉ
  // ---------------------------
  if (role !== "admin")
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🚫 Accès refusé
          </h1>
          <p className="text-gray-700">Réservé aux administrateurs.</p>
          <Link
            href="/login"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );

  // ---------------------------
  // PAGE ADMIN (affichage)
  // ---------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-inter p-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 " />
            Gestion des utilisateurs
          </h1>

          {/* Bouton Ajouter */}
          <AddUserDialog
            open={isAddDialogOpen}
            setOpen={setIsAddDialogOpen}
            newUser={newUser}
            setNewUser={setNewUser}
            handleAddUser={handleAddUser}
          />
        </div>

        <p className="text-muted-foreground">
          {employes.length} utilisateurs enregistrés
        </p>
      </motion.div>

      {/* RECHERCHE */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            className="pl-10 rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Rechercher un utilisateur…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU UTILISATEURS */}
      <Card className="rounded-xl shadow-sm border p-2 w-full">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Salaire</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date Création</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-muted/30 transition"
                >
                  {/* UTILISATEUR + AVATAR */}
                  <TableCell className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                      {user.prenom?.[0]}
                      {user.nom?.[0]}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {user.prenom} {user.nom}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.numTelephone || "—"}</TableCell>

                  <TableCell>{user.poste || "—"}</TableCell>

                  <TableCell>
                    {user.salaire ? `${user.salaire} DT` : "—"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className="rounded-full px-3 py-1 text-sm"
                      variant={
                        user.role === "employe" ? "outline" : "secondary"
                      }
                    >
                      {user.role === "employe" ? "Employé" : "Admin"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {user.dateEmbauche || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-lg shadow-xl"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-700"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          user={selectedUser}
          setUser={setSelectedUser}
          handleEditUser={handleEditUser}
        />
      )}
    </div>
  );
}
