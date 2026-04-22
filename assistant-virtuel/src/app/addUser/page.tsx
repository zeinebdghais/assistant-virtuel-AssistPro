"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "", prenom: "", username: "", email: "", password: "",
    numTelephone: "", poste: "", salaire: ""
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      ...formData,
      salaire: Number(formData.salaire),
      role: "employe"
    };

    const res = await fetch("/Gestionusers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Employé ajouté avec succès !");
      setIsError(false);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setMessage(data.error || "❌ Erreur lors de l'ajout");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Nouvel Employé</h1>
          <p className="text-gray-600">Remplissez les informations de l'employé</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange}
              className="border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange}
              className="border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <input type="text" name="numTelephone" placeholder="Téléphone" value={formData.numTelephone} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <input type="text" name="poste" placeholder="Poste" value={formData.poste} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <input type="number" name="salaire" placeholder="Salaire (TND)" value={formData.salaire} onChange={handleChange}
            className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Ajouter l'employé
          </button>

          {message && (
            <p className={`text-center font-medium ${isError ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </form>

        <button onClick={() => router.push("/dashboard")} className="w-full mt-4 text-gray-600 hover:text-gray-800 transition">
          ← Retour au dashboard
        </button>
      </div>
    </div>
  );
}