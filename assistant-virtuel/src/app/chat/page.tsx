"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Send, Paperclip, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mongoose from "mongoose";

type ApiReply = {
  reply?: string;
  response?: string;
  summary?: string;
  source?: string;
  error?: string;
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  source?: string;
}

const PYTHON_API_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL ?? "http://localhost:5000";

const MessageBubble = memo(function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex ${msg.isUser ? "justify-end" : "justify-start"} gap-2`}
    >
      {!msg.isUser && (
        <div className="flex items-start mt-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] p-3 text-sm leading-relaxed
          ${
            msg.isUser
              ? "bg-blue-600 text-white rounded-t-xl rounded-bl-xl"
              : "bg-gray-100 text-gray-800 rounded-b-xl rounded-tr-xl"
          }`}
      >
        {msg.isUser ? (
          <p>{msg.content}</p>
        ) : (
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        )}
        <div
          className={`text-[11px] mt-2 text-right ${
            msg.isUser ? "text-blue-100" : "text-gray-400"
          }`}
        >
          {msg.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
});

export default function AssistantPro() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendToApi = useCallback(async (text: string): Promise<ApiReply> => {
    try {
      const res = await fetch(`${PYTHON_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: `user-${Date.now()}` }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return { reply: "Le serveur Python est inaccessible." };
    }
  }, []);

  const saveMessage = useCallback(
    async (userMessage: string, apiReply: ApiReply) => {
      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            pythonResponse: apiReply,
            userId: `user-${Date.now()}`,
          }),
        });
      } catch (err) {
        console.error("Erreur sauvegarde FAQ :", err);
      }
    },
    []
  );

  const saveDocument = useCallback(
    async (filename: string, summary: string) => {
      try {
        await fetch("/api/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename,
            summary,
            userId: new mongoose.Types.ObjectId().toString(),
          }),
        });
      } catch (error) {
        console.error("Erreur sauvegarde document :", error);
      }
    },
    []
  );

  const handleSend = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if ((!input.trim() && !selectedFile) || loading) return;

      setLoading(true);

      const userText = input.trim();
      setInput("");

      // ===============================
      // CAS 1 : FICHIER + MESSAGE
      // ===============================
      if (selectedFile) {
        const file = selectedFile;
        setSelectedFile(null);

        const userMessage = userText
          ? `📄 ${file.name}\n${userText}`
          : `📄 Fichier envoyé : ${file.name}`;

        // Message utilisateur (1 seul)
        setMessages((m) => [
          ...m,
          {
            id: Date.now().toString(),
            content: userMessage,
            isUser: true,
            timestamp: new Date(),
          },
        ]);

        try {
          const form = new FormData();
          form.append("file", file);
          if (userText) form.append("message", userText);

          const res = await fetch(`${PYTHON_API_URL}/upload`, {
            method: "POST",
            body: form,
          });

          const apiReply: ApiReply = await res.json();
          const summary = apiReply.summary ?? "Résumé indisponible";

          // Message assistant
          setMessages((m) => [
            ...m,
            {
              id: (Date.now() + 1).toString(),
              content: summary,
              isUser: false,
              timestamp: new Date(),
            },
          ]);

          // 🔐 Sauvegardes
          await saveMessage(userMessage, apiReply);
          await saveDocument(file.name, summary);
        } catch (err) {
          console.error("Erreur upload fichier :", err);
        }

        setLoading(false);
        return; // ⬅️ IMPORTANT
      }

      // ===============================
      // CAS 2 : MESSAGE SEUL
      // ===============================
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          content: userText,
          isUser: true,
          timestamp: new Date(),
        },
      ]);

      const apiReply = await sendToApi(userText);

      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          content:
            apiReply.reply ?? apiReply.response ?? "Aucune réponse reçue.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);

      // 🔐 Sauvegarde message
      await saveMessage(userText, apiReply);

      setLoading(false);
    },
    [input, selectedFile, loading, sendToApi, saveMessage, saveDocument]
  );

  // const handleSend = useCallback(
  //   async (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if ((!input.trim() && !selectedFile) || loading) return;

  //     setLoading(true);

  //     // ===============================
  //     // CAS 1 : FICHIER SÉLECTIONNÉ
  //     // ===============================
  //     if (selectedFile) {
  //       const file = selectedFile;
  //       const question = input.trim(); // peut être vide

  //       // Message utilisateur (1 seul)
  //       setMessages((m) => [
  //         ...m,
  //         {
  //           id: Date.now().toString(),
  //           content: question
  //             ? `📄 ${file.name}\n${question}`
  //             : `📄 Fichier envoyé : ${file.name}`,
  //           isUser: true,
  //           timestamp: new Date(),
  //         },
  //       ]);

  //       setInput("");
  //       setSelectedFile(null);

  //       try {
  //         const form = new FormData();
  //         form.append("file", file);

  //         // On envoie le message SEULEMENT comme contexte (pas pour réponse)
  //         if (question) {
  //           form.append("message", question);
  //         }

  //         const res = await fetch(`${PYTHON_API_URL}/upload`, {
  //           method: "POST",
  //           body: form,
  //         });

  //         const data: ApiReply = await res.json();

  //         const summary = data.summary ?? "Résumé indisponible";

  //         // Message assistant (UN SEUL)
  //         setMessages((m) => [
  //           ...m,
  //           {
  //             id: (Date.now() + 1).toString(),
  //             content: summary,
  //             isUser: false,
  //             timestamp: new Date(),
  //           },
  //         ]);
  //       } catch (err) {
  //         console.error("Upload error:", err);
  //       }

  //       setLoading(false);
  //       return; // ⬅️ TRÈS IMPORTANT
  //     }

  //     // ===============================
  //     // CAS 2 : MESSAGE SEUL (CHAT)
  //     // ===============================
  //     const content = input.trim();
  //     setInput("");

  //     setMessages((m) => [
  //       ...m,
  //       {
  //         id: Date.now().toString(),
  //         content,
  //         isUser: true,
  //         timestamp: new Date(),
  //       },
  //     ]);

  //     const apiReply = await sendToApi(content);

  //     setMessages((m) => [
  //       ...m,
  //       {
  //         id: (Date.now() + 1).toString(),
  //         content:
  //           apiReply.reply ?? apiReply.response ?? "Aucune réponse reçue.",
  //         isUser: false,
  //         timestamp: new Date(),
  //       },
  //     ]);

  //     setLoading(false);
  //   },
  //   [input, selectedFile, loading, sendToApi]
  // );

  // const handleSend = useCallback(
  //   async (e?: React.FormEvent) => {
  //     e?.preventDefault();
  //     if ((!input.trim() && !selectedFile) || loading) return;

  //     setLoading(true);

  //     if (input.trim()) {
  //       const content = input.trim();
  //       setInput("");

  //       const userMsg: Message = {
  //         id: Date.now().toString(),
  //         content,
  //         isUser: true,
  //         timestamp: new Date(),
  //       };
  //       setMessages((m) => [...m, userMsg]);

  //       const apiReply = await sendToApi(content);

  //       await saveMessage(content, apiReply);

  //       const botMsg: Message = {
  //         id: (Date.now() + 1).toString(),
  //         content:
  //           apiReply.reply ?? apiReply.response ?? "Aucune réponse reçue.",
  //         isUser: false,
  //         timestamp: new Date(),
  //         source: apiReply.source,
  //       };
  //       setMessages((m) => [...m, botMsg]);
  //     }

  //     if (selectedFile) {
  //       const file = selectedFile;
  //       setSelectedFile(null);

  //       try {
  //         const form = new FormData();
  //         form.append("file", file);

  //         // Upload fichier vers serveur Python
  //         const res = await fetch(`${PYTHON_API_URL}/upload`, {
  //           method: "POST",
  //           body: form,
  //         });
  //         const data: ApiReply = await res.json();
  //         const summary = data.summary ?? "Résumé indisponible";

  //         // Sauvegarde document
  //         await fetch("/api/document", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             filename: file.name,
  //             summary,
  //             userId: new mongoose.Types.ObjectId().toString(),
  //           }),
  //         });

  //         // Message utilisateur
  //         setMessages((m) => [
  //           ...m,
  //           {
  //             id: "upload-" + Date.now(),
  //             content: `📄 Fichier envoyé : ${file.name}`,
  //             isUser: true,
  //             timestamp: new Date(),
  //           },
  //         ]);

  //         // Message bot
  //         setMessages((m) => [
  //           ...m,
  //           {
  //             id: "summary-" + Date.now(),
  //             content: summary,
  //             isUser: false,
  //             timestamp: new Date(),
  //           },
  //         ]);
  //       } catch (err) {
  //         console.error("Upload error:", err);
  //       }
  //     }

  //     setLoading(false);
  //   },
  //   [input, selectedFile, loading, sendToApi, saveMessage]
  // );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50/60 via-white to-white">
      <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-xl bg-white">
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Assistant IA</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
            En ligne
          </span>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 relative overflow-y-auto p-6 space-y-4 bg-gray-50">
          {!hasMessages && !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center px-4">
              👋 Bonjour ! Envoyez un fichier pour résumé ou posez une question.
            </div>
          )}
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MessageBubble msg={m} />
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="text-sm text-gray-400 animate-pulse">
              Assistant en train d’écrire…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* INPUT */}
        <div className="border-t px-6 py-4 flex items-center gap-3 bg-white">
          <label className="cursor-pointer relative flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            {selectedFile && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded-full">
                {selectedFile.name}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedFile(null)}
                />
              </span>
            )}
          </label>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ou envoyez un fichier…"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-emerald-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
