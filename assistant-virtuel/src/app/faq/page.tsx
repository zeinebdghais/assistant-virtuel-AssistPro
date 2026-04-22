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
          className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm md:text-base font-medium text-gray-900">
              {item.question}
            </h3>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
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
        console.log("data : ", data);
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
