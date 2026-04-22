"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface EditUserDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: any;
  setUser: (value: any) => void;
  handleEditUser: () => void;
}

const fields = [
  { name: "nom", label: "Nom", type: "text", colSpan: 1 },
  { name: "prenom", label: "Prénom", type: "text", colSpan: 1 },
  { name: "email", label: "Email", type: "email", colSpan: 2 },
  { name: "username", label: "Nom d’utilisateur", type: "text", colSpan: 2 },
  {
    name: "role",
    label: "Rôle",
    type: "select",
    options: ["employe", "admin"],
    colSpan: 2,
  },
  { name: "numTelephone", label: "Téléphone", type: "text", colSpan: 1 },
  { name: "poste", label: "Poste", type: "text", colSpan: 1 },
  { name: "salaire", label: "Salaire (DT)", type: "number", colSpan: 2 },
];

export default function EditUserDialog({
  open,
  setOpen,
  user,
  setUser,
  handleEditUser,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-xl max-w-lg bg-white p-6 shadow-xl border border-gray-200">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Modifier l'utilisateur
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Modifiez les informations de l'utilisateur.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.colSpan === 2 ? "col-span-2" : ""}
            >
              <Label className="text-gray-700 mb-1">{field.label}</Label>
              {field.type === "select" ? (
                <select
                  className="w-full h-10 px-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  value={user[field.name]}
                  onChange={(e) =>
                    setUser({ ...user, [field.name]: e.target.value })
                  }
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "employe" ? "Employé" : "Admin"}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type}
                  value={user[field.name] || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      [field.name]:
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 text-gray-700"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleEditUser}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
