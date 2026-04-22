// app/api/popular-faqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import FAQ from "@/models/FAQ";
import { dbConnect } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Récupérer les questions ET réponses de MongoDB
    const faqs = await FAQ.find({ isActive: true })
      .select("question reponse usageCount") // AJOUTÉ: reponse
      .sort({ usageCount: -1 })
      .limit(10);

    if (faqs.length === 0) {
      return NextResponse.json({
        topQuestions: [],
        topQuestionsWithAnswers: [], // NOUVEAU: questions avec réponses
        message: "Aucune question dans la FAQ",
      });
    }

    // Extraire les questions pour le NLP
    const questions = faqs.map((faq) => faq.question);

    // Tenter d'appeler le serveur Python NLP
    try {
      const pythonResponse = await fetch("http://localhost:5000/process-faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
        signal: AbortSignal.timeout(3000),
      });

      if (pythonResponse.ok) {
        const pythonData = await pythonResponse.json();
        const topQuestions =
          pythonData.topQuestions?.slice(0, 3) || questions.slice(0, 3);

        // Associer les réponses aux questions
        const topQuestionsWithAnswers = topQuestions.map((question: string) => {
          // Trouver la réponse correspondante dans les FAQs
          const matchingFAQ = faqs.find((faq) => faq.question === question);
          return {
            question,
            answer: matchingFAQ?.reponse || null,
            usageCount: matchingFAQ?.usageCount || 0,
          };
        });

        return NextResponse.json({
          topQuestions,
          topQuestionsWithAnswers, // NOUVEAU: questions avec réponses
          source: "python-processed",
          totalFAQs: faqs.length,
        });
      }
    } catch (pythonError) {
      console.log("Serveur Python non disponible, fallback MongoDB");
    }

    // Fallback: utiliser les 3 premières questions de MongoDB avec réponses
    const topFAQs = faqs.slice(0, 3);
    const topQuestions = topFAQs.map((faq) => faq.question);
    const topQuestionsWithAnswers = topFAQs.map((faq) => ({
      question: faq.question,
      answer: faq.reponse,
      usageCount: faq.usageCount || 0,
    }));

    return NextResponse.json({
      topQuestions,
      topQuestionsWithAnswers, // NOUVEAU: questions avec réponses
      source: "mongodb-fallback",
      totalFAQs: faqs.length,
    });
  } catch (error) {
    console.error("Erreur récupération FAQs:", error);

    // Fallback hardcodé avec réponses simulées
    const fallbackQuestions = [
      "Comment demander des congés?",
      "Comment contacter les ressources humaines?",
      "Qui contacter pour un problème informatique?",
    ];

    return NextResponse.json(
      {
        topQuestions: fallbackQuestions,
        source: "hardcoded-fallback",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 200 } // Toujours retourner 200 pour que le frontend affiche quelque chose
    );
  }
}
