"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Star,
  Users,
  MessageCircle,
  MessageCircleQuestionMark,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================= TYPES ================= */

interface Stats {
  title: string;
  value: number;
  icon: any;
  color: string;
}

interface RatingData {
  name: string;
  value: number;
  color: string;
}

interface ActivityData {
  name: string;
  documents: number;
  questions: number;
}

interface APIStats {
  nbUsers: number;
  nbQuestions: number;
  nbFeedbacks: number;
  nbDocuments: number;
  ratingDistribution: RatingData[];
  activityData: ActivityData[];
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FeedbackItem {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [ratingData, setRatingData] = useState<RatingData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const defaultRatingColors = [
    "#0ea5e9",
    "#16a34a",
    "#facc15",
    "#a78bfa",
    "#ef4444",
  ];

  const renderRatingStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${
          star <= rating
            ? "fill-yellow-500 text-yellow-500"
            : "text-muted-foreground/40"
        }`}
      />
    ));

  useEffect(() => {
    async function fetchData() {
      try {
        // ===== STATS =====
        const statsRes = await fetch("/api/stats");
        const statsData: APIStats = await statsRes.json();

        setStats([
          {
            title: "Nombre d'employés",
            value: statsData.nbUsers,
            icon: Users,
            color: "bg-blue-500/10 text-blue-600",
          },
          {
            title: "Nombre de questions",
            value: statsData.nbQuestions,
            icon: MessageCircle,
            color: "bg-green-500/10 text-green-600",
          },
          {
            title: "Nombre de feedbacks",
            value: statsData.nbFeedbacks,
            icon: Star,
            color: "bg-yellow-500/10 text-yellow-600",
          },
          {
            title: "Nombre de documents",
            value: statsData.nbDocuments,
            icon: Star,
            color: "bg-purple-500/10 text-purple-600",
          },
        ]);

        setRatingData(
          statsData.ratingDistribution.map((item, index) => ({
            ...item,
            color: defaultRatingColors[index] || "#888",
          }))
        );

        setActivityData(statsData.activityData || []);

        // ===== FAQ =====
        const faqRes = await fetch("/api/popular-faqs");
        const faqJson = await faqRes.json();
        const faqsArray = Array.isArray(faqJson.topQuestionsWithAnswers)
          ? faqJson.topQuestionsWithAnswers
          : [];

        const mappedFaqs: FaqItem[] = faqsArray.map((faq: any, i: number) => ({
          id: i + 1,
          question: faq.question,
          answer: faq.answer,
        }));

        setFaqData(mappedFaqs);
        setOpenItemId(mappedFaqs[0]?.id ?? null);

        // ===== Feedbacks =====
        const feedbackRes = await fetch("/api/feedback");
        const feedbackJson = await feedbackRes.json();
        const latestFeedbacks = feedbackJson.slice(0, 4).map((fb: any) => ({
          user: `${fb.userId.nom} ${fb.userId.prenom}`,
          rating: fb.note,
          comment: fb.content,
          date: new Date(fb.dateFeedback).toLocaleString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
        }));

        setFeedbacks(latestFeedbacks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!query) return faqData;
    const q = query.toLowerCase();
    return faqData.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqData, query]);

  if (loading)
    return <div className="p-8 text-center text-lg">Chargement...</div>;

  return (
    <div className="p-12 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Vue d’ensemble de l’activité de la plateforme
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 flex flex-col gap-2">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* BAR CHART */}
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Activité (7 derniers
              jours)
            </CardTitle>
            <CardDescription>Documents et questions par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="documents" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="questions" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PIE CHART */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Satisfaction
            </CardTitle>
            <CardDescription>Répartition des notes</CardDescription>
          </CardHeader>


          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={ratingData.filter((entry) => entry.value > 0)}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={90}
                >
                  {ratingData
                    .filter((entry) => entry.value > 0)
                    .map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* ===== LÉGENDE ===== */}
            <div className="mt-4 flex flex-col gap-2">
              {ratingData
                .filter((entry) => entry.value > 0)
                .map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}</span>
                    </div>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ + Feedbacks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleQuestionMark className="w-5 h-5 text-blue-600" />{" "}
              Questions les plus posées par les utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border rounded-lg p-3">
                  <button
                    className="flex justify-between w-full text-left font-medium"
                    onClick={() =>
                      setOpenItemId(openItemId === faq.id ? null : faq.id)
                    }
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`transition-transform ${
                        openItemId === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openItemId === faq.id && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <ReactMarkdown>{faq.answer}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && <p>Aucune FAQ trouvée</p>}
            </div>
          </CardContent>
        </Card>

        {/* Feedbacks */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Derniers feedbacks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{fb.user}</span>
                    <div className="flex gap-0.5">
                      {renderRatingStars(fb.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {fb.comment}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {fb.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
