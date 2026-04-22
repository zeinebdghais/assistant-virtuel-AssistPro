"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") router.push("/dashboard");
        else if (data.user.role === "employe") router.push("/home");
        else setMessage("Rôle utilisateur non reconnu");
      } else {
        setMessage(data.error || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-gray-100 px-6">
      <div className="flex w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-xl animate-fadeIn">
        {/* Left: Login Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
          <p className="text-sm text-gray-500 mb-6">
            Accédez à votre espace personnel
          </p>

          <form onSubmit={handleLogin}>
            <label className="block mb-4">
              <span className="text-gray-700 text-xs font-medium">Email</span>
              <input
                type="email"
                placeholder="vous@entreprise.com"
                className="mt-1 w-full p-3 rounded-lg border border-gray-300 bg-white/70 text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 text-xs font-medium">
                Mot de passe
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full p-3 rounded-lg border border-gray-300 bg-white/70 text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white font-medium text-sm shadow-md transition-all"
            >
              Se connecter →
            </button>

            {message && (
              <p className="mt-4 text-xs text-red-500 text-center">{message}</p>
            )}
          </form>
        </div>

        {/* Right: Welcome Panel */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex flex-col items-center justify-center p-10">
          <div className="p-4 bg-white/20 rounded-2xl mb-6 shadow-lg">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">AssistPro</h1>
            </div>
            <p className="text-sm leading-relaxed">
              Bienvenue sur AssistPro. Votre assistant virtuel intelligent pour
              optimiser la communication au sein de votre entreprise.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}
