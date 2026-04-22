// import User from "@/models/User";
// import FAQ from "@/models/FAQ";
// import Feedback from "@/models/feedback";
// import DocumentModel from "@/models/Document";
// import mongoose from "mongoose";

// export async function GET() {
//   try {
//     if (!mongoose.connection.readyState) {
//       await mongoose.connect(process.env.MONGODB_URI || "");
//     }

//     // Récupérer les stats
//     const [nbUsers, nbQuestions, nbFeedbacks, nbDocuments, allFeedbacks] =
//       await Promise.all([
//         User.countDocuments(),
//         FAQ.countDocuments(),
//         Feedback.countDocuments(),
//         DocumentModel.countDocuments(),
//         Feedback.find(), // pour la répartition des notes
//       ]);

//     // Répartition des notes pour le pie chart
//     const ratingDistribution = [5, 4, 3, 2, 1].map((note) => ({
//       name: `${note} étoiles`,
//       value: allFeedbacks.filter((f) => f.note === note).length,
//       color:
//         note === 5
//           ? "hsl(var(--primary))"
//           : note === 4
//           ? "hsl(var(--accent))"
//           : note === 3
//           ? "hsl(var(--warning))"
//           : note === 2
//           ? "hsl(var(--muted-foreground))"
//           : "hsl(var(--destructive))",
//     }));

//     return new Response(
//       JSON.stringify({
//         nbUsers,
//         nbQuestions,
//         nbFeedbacks,
//         nbDocuments,
//         ratingDistribution,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Erreur serveur" }), {
//       status: 500,
//     });
//   }
// }

import User from "@/models/User";
import FAQ from "@/models/FAQ";
import Feedback from "@/models/feedback";
import DocumentModel from "@/models/Document";
import mongoose from "mongoose";

export async function GET() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    /* ================= STATS SIMPLES ================= */
    const [nbUsers, nbQuestions, nbFeedbacks, nbDocuments] = await Promise.all([
      User.countDocuments(),
      FAQ.countDocuments(),
      Feedback.countDocuments(),
      DocumentModel.countDocuments(),
    ]);

    /* ================= PIE CHART (RATINGS) ================= */
    const ratingsAgg = await Feedback.aggregate([
      {
        $group: {
          _id: "$note",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingDistribution = [5, 4, 3, 2, 1].map((note) => {
      const found = ratingsAgg.find((r) => r._id === note);
      return {
        name: `${note} étoiles`,
        value: found ? found.count : 0,
      };
    });

    /* ================= BAR CHART (7 DERNIERS JOURS) ================= */
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 6); // 7 jours (aujourd'hui inclus)

    // Documents par jour
    const documentsAgg = await DocumentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Questions par jour
    const questionsAgg = await FAQ.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Générer les 7 jours
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const key = d.toISOString().split("T")[0];

      const documents = documentsAgg.find((x) => x._id === key)?.count || 0;
      const questions = questionsAgg.find((x) => x._id === key)?.count || 0;

      return {
        name: d.toLocaleDateString("fr-FR", { weekday: "short" }),
        documents,
        questions,
      };
    });

    /* ================= RESPONSE ================= */
    return new Response(
      JSON.stringify({
        nbUsers,
        nbQuestions,
        nbFeedbacks,
        nbDocuments,
        ratingDistribution,
        activityData: days, // 👈 BAR CHART
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("STATS ERROR:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
}
