"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  onFeedbackAdded?: () => void; // callback déclenché après ajout
}

export function FeedbackDialog({ onFeedbackAdded }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState("");
  const [note, setNote] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ content, note }),
      headers: {
        "Content-Type": "application/json",
        "x-user-role": user.role,
        "x-user-id": user.id,
      },
    });

    if (res.ok) {
      setContent("");
      setNote(0);
      setOpen(false); // ferme le dialogue
      onFeedbackAdded?.(); // rafraîchit la liste dans le parent
    } else {
      console.error("Erreur lors de l’envoi de l’avis");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Partager votre avis</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouveau avis</DialogTitle>
            <DialogDescription>
              Votre avis compte ! Dites-nous ce que vous pensez de l'assistant.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ⭐ Évaluation */}
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className={cn(
                    "cursor-pointer transition-all",
                    (hovered || note) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  )}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setNote(star)}
                />
              ))}
            </div>

            {/* 💬 Texte de l’avis */}
            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Votre avis
              </label>
              <Textarea
                id="feedback"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dites-nous ce que vous en pensez..."
                className="resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:bg-blue-600 text-white"
              type="submit"
              disabled={note === 0 || !content.trim()}
            >
              Envoyer l’avis
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
