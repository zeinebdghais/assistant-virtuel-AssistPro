// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { MessageSquare, HelpCircle, Star, Bell } from "lucide-react";

// // TYPES
// interface User {
//   prenom: string;
//   nom: string;
//   role: "employe" | "admin";
//   avatar: string;
// }

// interface FeatureCardProps {
//   icon: React.ElementType;
//   title: string;
//   description: string;
//   link: string;
//   bg: string;
//   color: string;
// }

// // === COMPONENTS === //

// const FeatureCard = ({
//   icon: Icon,
//   title,
//   description,
//   link,
//   bg,
//   color,
// }: FeatureCardProps) => {
//   const router = useRouter();

//   return (
//     <div
//       onClick={() => router.push(link)}
//       className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
//     >
//       <div
//         className={`${bg} w-11 h-11 rounded-full flex items-center justify-center mb-4`}
//       >
//         <Icon className={`w-6 h-6 ${color}`} />
//       </div>

//       <h3 className="font-semibold text-gray-900 mb-1 text-base">{title}</h3>
//       <p className="text-gray-500 text-sm">{description}</p>
//     </div>
//   );
// };

// // =========================== //
// //           PAGE              //
// // =========================== //

// export default function Home() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<User | null>(null);

//   // Vérification de connexion
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (!token || !userData) {
//       router.push("/login");
//       return;
//     }

//     setUser(JSON.parse(userData));
//     setLoading(false);
//   }, [router]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Chargement...</p>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 font-inter p-6">
//       <div className="w-full px-6 lg:px-8 pt-10 space-y-12">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//             <span className="mr-2">Bonjour</span>
//             <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
//               {user.prenom}
//             </span>
//           </h1>
//         </div>

//         {/* FEATURE CARDS */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//           <FeatureCard
//             icon={MessageSquare}
//             title="Chat"
//             description="Posez vos questions"
//             link="/chat"
//             bg="bg-blue-100"
//             color="text-blue-600"
//           />

//           <FeatureCard
//             icon={HelpCircle}
//             title="FAQ"
//             description="Réponses fréquentes"
//             link="/faq"
//             bg="bg-teal-100"
//             color="text-teal-600"
//           />

//           <FeatureCard
//             icon={Star}
//             title="Feedback"
//             description="Votre avis compte"
//             link="/feedback"
//             bg="bg-yellow-100"
//             color="text-yellow-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, HelpCircle, Star } from "lucide-react";

// TYPES
interface User {
  prenom: string;
  nom: string;
  role: "employe" | "admin";
  avatar: string;
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  bg: string;
  color: string;
}

// === COMPONENTS === //
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  link,
  bg,
  color,
}: FeatureCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(link)}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
    >
      <div
        className={`${bg} w-11 h-11 rounded-full flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 text-base">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

// =========================== //
//           PAGE              //
// =========================== //
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Vérification de connexion
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-inter p-6">
      <div className="w-full px-6 lg:px-8 pt-10 space-y-12">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">Bonjour</span>
            <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
              {user.prenom}
            </span>
          </h1>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={MessageSquare}
            title="Chat"
            description="Posez vos questions"
            link="/chat"
            bg="bg-blue-100"
            color="text-blue-600"
          />

          <FeatureCard
            icon={HelpCircle}
            title="FAQ"
            description="Réponses fréquentes"
            link="/faq"
            bg="bg-teal-100"
            color="text-teal-600"
          />

          <FeatureCard
            icon={Star}
            title="Feedback"
            description="Votre avis compte"
            link="/feedback"
            bg="bg-yellow-100"
            color="text-yellow-600"
          />
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-10 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 max-w-full mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold text-black mb-3">
            💬 Commencez à utiliser votre assistant IA
          </h2>
          <p className="text-gray-800 text-lg">
            Posez vos questions et trouvez rapidement les informations dont vous
            avez besoin.
          </p>

          <button
            onClick={() => router.push("/chat")}
            className="mt-2 px-6 py-3 text-blue-600 rounded-xl shadow-lg hover:bg-gray-100 transition-colors text-base font-semibold bg-white"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}
