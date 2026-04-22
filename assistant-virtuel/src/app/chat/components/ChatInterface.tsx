"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  source?: string;
  confidence?: string;
}

const PYTHON_API_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:5000";

const formatResponse = (text: string) =>
  text.split("\n").map((line, index) => {
    if (line.startsWith("###"))
      return (
        <div key={index} className="font-semibold text-blue-800 mt-2 mb-1">
          {line.replace("###", "").trim()}
        </div>
      );
    if (line.trim().startsWith("-"))
      return (
        <div key={index} className="flex items-start ml-4 mb-1">
          <span className="text-blue-500 mr-2">•</span>
          <span>{line.replace("-", "").trim()}</span>
        </div>
      );
    if (line.trim() === "") return <br key={index} />;
    return <div key={index}>{line}</div>;
  });

export default function ProChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPythonOnline, setIsPythonOnline] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const domains = [
    { icon: "💼", name: "Entreprise", desc: "Culture & organisation" },
    { icon: "👥", name: "RH", desc: "Politiques RH" },
    { icon: "💰", name: "Rémunération", desc: "Salaires & avantages" },
    { icon: "📄", name: "Documents", desc: "Contrats & formulaires" },
    { icon: "🖥️", name: "IT", desc: "Support technique" },
    { icon: "🔒", name: "Sécurité", desc: "Cybersécurité" },
    { icon: "🏢", name: "Bureaux", desc: "Locaux & équipements" },
    { icon: "📅", name: "Congés", desc: "Absences & RTT" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input; // Sauvegarder l'input avant de le clear
    setInput("");
    setLoading(true);

    try {
      // 1. Appel au chatbot Python
      const response = await fetch(`${PYTHON_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          user_id: `user-${Date.now()}`,
        }),
      });
      
      if (!response.ok) throw new Error("Erreur API Python");
      
      const pythonData = await response.json();
      
      // 2. Sauvegarde dans la FAQ via l'API Next.js
      try {
        const saveResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userInput,
            pythonResponse: pythonData,
            userId: `user-${Date.now()}`
          }),
        });

        const saveResult = await saveResponse.json();
        console.log('💾 Résultat sauvegarde FAQ:', saveResult);
        
        if (saveResult.saved) {
          console.log('✅ FAQ sauvegardée avec ID:', saveResult.id);
        }
      } catch (saveError) {
        console.error('❌ Erreur sauvegarde FAQ:', saveError);
        // Ne pas bloquer le chat si la sauvegarde échoue
      }

      // 3. Ajouter la réponse du bot aux messages
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: pythonData.reply || pythonData.response,
        isUser: false,
        timestamp: new Date(),
        source: pythonData.source || "bot",
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsPythonOnline(true);
      
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "❌ Le serveur Python est inaccessible",
          isUser: false,
          timestamp: new Date(),
          source: "error",
        },
      ]);
      setIsPythonOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadedFile(file);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: `📄 Upload : ${file.name}`,
        isUser: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${PYTHON_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload error");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: data.summary,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "❌ Erreur upload fichier",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto h-[750px] bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="font-bold text-xl">Assistant Virtuel RH</h2>
            <p className="text-blue-100 text-sm">
              Service 24/7 - Réponses instantanées
            </p>
          </div>
        </div>
        {/* <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPythonOnline
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isPythonOnline ? "Python Online" : "Python Offline"}
        </span> */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-linear-to-br from-gray-50 to-blue-50 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-6">
            <div className="text-5xl mb-4">👋</div>
            <h3 className="text-xl font-semibold mb-2">Bonjour !</h3>
            <p className="text-sm mb-6">
              Je suis votre assistant RH intelligent
            </p>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {domains.map((d, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <div className="font-semibold text-gray-700">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-xl shadow ${
                msg.isUser ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              }`}
            >
              {!msg.isUser ? (
                formatResponse(msg.content)
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
              <div className="text-xs text-gray-400 mt-2 flex justify-end">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-4 rounded-xl shadow bg-white animate-pulse text-gray-500">
              Réflexion en cours...
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex items-center p-5 bg-white border-t gap-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 p-2 rounded-md"
        >
          📎
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          type="text"
          placeholder="Posez votre question RH..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border border-blue-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}