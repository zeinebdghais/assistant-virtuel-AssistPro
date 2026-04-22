"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackEditDialogProps {
  feedback: { _id: string; content: string; note: number };
  open: boolean;
  setOpen: (val: boolean) => void;
  onFeedbackUpdated?: () => void;
}

export function FeedbackEditDialog({
  feedback,
  open,
  setOpen,
  onFeedbackUpdated,
}: FeedbackEditDialogProps) {
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState(feedback.content);
  const [note, setNote] = useState(feedback.note);

  useEffect(() => {
    setContent(feedback.content);
    setNote(feedback.note);
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(`/api/feedback/${feedback._id}`, {
      method: "PUT",
      body: JSON.stringify({ content, note }),
      headers: {
        "Content-Type": "application/json",
        "x-user-role": user.role,
        "x-user-id": user.id,
      },
    });

    if (res.ok) {
      setOpen(false);
      onFeedbackUpdated?.();
    } else {
      console.error("Erreur lors de la modification de l’avis");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier votre avis</DialogTitle>
            <DialogDescription>
              Vous pouvez mettre à jour votre note et votre commentaire.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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

            <div className="grid gap-2">
              <label htmlFor="feedback-edit" className="text-sm font-medium">
                Votre avis
              </label>
              <Textarea
                id="feedback-edit"
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
              Modifier l’avis
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
