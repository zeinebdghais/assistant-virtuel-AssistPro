// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MessageCircleQuestionMark, Plus, Minus } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// interface FaqItem {
//   id: number;
//   question: string;
//   answer: string;
// }

// interface AccordionItemProps {
//   item: FaqItem;
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const AccordionItem = ({ item, isOpen, onToggle }: AccordionItemProps) => {
//   return (
//     <motion.div
//       layout
//       initial={false}
//       className={`mb-4 border rounded-lg overflow-hidden transition-all duration-300
//         ${isOpen ? "border-pink-300 shadow-lg" : "border-gray-200"}`}
//     >
//       <header
//         onClick={onToggle}
//         className={`flex justify-between items-center p-4 cursor-pointer
//           ${isOpen ? "bg-pink-50" : "bg-white hover:bg-gray-50"}`}
//       >
//         <h2 className="text-base font-medium text-gray-900 pr-4">
//           {item.question}
//         </h2>
//         {isOpen ? (
//           <Minus className="w-5 h-5 text-pink-500" />
//         ) : (
//           <Plus className="w-5 h-5 text-gray-500" />
//         )}
//       </header>

//       <AnimatePresence initial={false}>
//         {isOpen && (
//           <motion.div
//             key="content"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="p-4 pt-0 border-t border-pink-300">
//               <div className="py-4 text-pink-600 text-sm prose prose-pink max-w-none">
//                 <ReactMarkdown>{item.answer}</ReactMarkdown>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default function FAQ() {
//   const [faqData, setFaqData] = useState<FaqItem[]>([]);
//   const [openItemId, setOpenItemId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   /* ================= FETCH API ================= */

//   useEffect(() => {
//     fetchFaqs();
//   }, []);

//   const fetchFaqs = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch("/api/popular-faqs");
//       const data = await res.json();

//       console.log("📦 API FAQ DATA =", data);

//       if (!res.ok) {
//         throw new Error(data?.error || "Erreur API");
//       }

//       const faqsArray = Array.isArray(data.topQuestionsWithAnswers)
//         ? data.topQuestionsWithAnswers
//         : [];

//       if (faqsArray.length === 0) {
//         throw new Error("Aucune FAQ trouvée");
//       }

//       const mappedFaqs: FaqItem[] = faqsArray.map(
//         (faq: any, index: number) => ({
//           id: index + 1,
//           question: faq.question,
//           answer: faq.answer,
//         })
//       );

//       setFaqData(mappedFaqs);
//       setOpenItemId(mappedFaqs[0].id);
//     } catch (err) {
//       console.error("❌ FAQ FETCH ERROR:", err);
//       setError("Impossible de charger les questions fréquentes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="p-20 bg-gray-50 min-h-screen">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <h1 className="text-2xl font-semibold flex items-center gap-2 mb-2 text-gray-800">
//           <MessageCircleQuestionMark className="w-6 h-6 text-orange-400" />
//           Questions Fréquemment Posées
//         </h1>

//         <p className="text-gray-600 text-sm mb-8">
//           Sélectionnez une question pour obtenir une réponse
//         </p>

//         {/* ===== CONTENT ===== */}
//         <div className="max-w-4xl mx-auto mt-10">
//           {loading && (
//             <p className="text-center text-gray-500 py-10">
//               Chargement des questions…
//             </p>
//           )}

//           {error && <p className="text-center text-red-500 py-10">{error}</p>}

//           {!loading &&
//             !error &&
//             faqData.map((item) => (
//               <AccordionItem
//                 key={item.id}
//                 item={item}
//                 isOpen={item.id === openItemId}
//                 onToggle={() =>
//                   setOpenItemId(openItemId === item.id ? null : item.id)
//                 }
//               />
//             ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

/***********************************version************************************** */

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MessageCircleQuestionMark, Plus, Minus } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// interface FaqItem {
//   id: number;
//   question: string;
//   answer: string;
// }

// const AccordionItem = ({
//   item,
//   isOpen,
//   onToggle,
// }: {
//   item: FaqItem;
//   isOpen: boolean;
//   onToggle: () => void;
// }) => (
//   <motion.div
//     layout
//     initial={false}
//     whileHover={{ scale: 1.01 }}
//     className={`rounded-lg border transition-all duration-300
//       ${
//         isOpen
//           ? "border-blue-400 shadow-md bg-white"
//           : "border-gray-200 bg-white"
//       }`}
//   >
//     <header
//       onClick={onToggle}
//       className="flex justify-between items-center px-6 py-4 cursor-pointer"
//     >
//       <h2 className="text-base md:text-lg font-medium text-gray-800">
//         {item.question}
//       </h2>
//       {isOpen ? (
//         <Minus className="w-5 h-5 text-blue-600" />
//       ) : (
//         <Plus className="w-5 h-5 text-gray-400" />
//       )}
//     </header>

//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           key="content"
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           exit={{ opacity: 0, height: 0 }}
//           transition={{ duration: 0.25 }}
//         >
//           <div className="px-6 pb-6 border-t border-gray-200">
//             <div className="pt-2 text-gray-700 prose max-w-none">
//               <ReactMarkdown>{item.answer}</ReactMarkdown>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   </motion.div>
// );

// export default function FAQ() {
//   const [faqData, setFaqData] = useState<FaqItem[]>([]);
//   const [openItemId, setOpenItemId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchFaqs();
//   }, []);

//   const fetchFaqs = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch("/api/popular-faqs");
//       const data = await res.json();

//       const faqsArray = Array.isArray(data.topQuestionsWithAnswers)
//         ? data.topQuestionsWithAnswers
//         : [];
//       if (!faqsArray.length) throw new Error("Aucune FAQ trouvée");

//       const mappedFaqs: FaqItem[] = faqsArray.map((faq: any, i: number) => ({
//         id: i + 1,
//         question: faq.question,
//         answer: faq.answer,
//       }));

//       setFaqData(mappedFaqs);
//       setOpenItemId(mappedFaqs[0].id);
//     } catch (err) {
//       setError("Impossible de charger les questions fréquentes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* HERO */}
//         <div className="text-center mb-12">
//           <div className="flex justify-center mb-4">
//             <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
//               <MessageCircleQuestionMark className="w-7 h-7" />
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
//             FAQ – Vos questions
//           </h1>
//           <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
//             Retrouvez ici les réponses aux questions les plus fréquentes
//             concernant nos services.
//           </p>
//         </div>

//         {/* FAQ CONTENT */}
//         <div className="space-y-4">
//           {loading && (
//             <p className="text-gray-500 text-center py-8">Chargement…</p>
//           )}
//           {error && <p className="text-red-500 text-center py-8">{error}</p>}
//           {!loading &&
//             !error &&
//             faqData.map((item) => (
//               <AccordionItem
//                 key={item.id}
//                 item={item}
//                 isOpen={item.id === openItemId}
//                 onToggle={() =>
//                   setOpenItemId(openItemId === item.id ? null : item.id)
//                 }
//               />
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }

/*********************************************************** */

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircleQuestionMark,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function FaqCard({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div variants={itemAnim} layout>
      <Card
        className={`overflow-hidden transition-shadow ${
          isOpen ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {item.question}
            </h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CardContent className="px-6 pb-6 pt-2">
                <div className="prose max-w-none text-gray-700">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function FAQ() {
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/popular-faqs");
        const data = await res.json();
        const faqsArray = Array.isArray(data.topQuestionsWithAnswers)
          ? data.topQuestionsWithAnswers
          : [];
        if (!faqsArray.length) throw new Error("Aucune FAQ trouvée");
        const mapped: FaqItem[] = faqsArray.map((faq: any, i: number) => ({
          id: i + 1,
          question: faq.question,
          answer: faq.answer,
        }));
        setFaqData(mapped);
        setOpenItemId(mapped[0]?.id ?? null);
      } catch (e) {
        setError("Impossible de charger les questions fréquentes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return faqData;
    const q = query.toLowerCase();
    return faqData.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqData, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-white py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <MessageCircleQuestionMark className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            FAQ – Vos questions
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Retrouvez ici les réponses aux questions les plus fréquentes
            concernant nos services.
          </p>
        </div>

        {/* SEARCH + STATS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question…"
              className="pl-9 h-11"
            />
          </div>
          <Badge
            variant="secondary"
            className="h-11 flex items-center justify-center"
          >
            {filtered.length} résultat(s)
          </Badge>
        </div>

        {/* CONTENT */}
        {loading && (
          <p className="text-center text-gray-500 py-16">Chargement…</p>
        )}
        {error && <p className="text-center text-red-500 py-16">{error}</p>}

        {!loading && !error && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4"
          >
            {filtered.map((item) => (
              <FaqCard
                key={item.id}
                item={item}
                isOpen={item.id === openItemId}
                onToggle={() =>
                  setOpenItemId(openItemId === item.id ? null : item.id)
                }
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
