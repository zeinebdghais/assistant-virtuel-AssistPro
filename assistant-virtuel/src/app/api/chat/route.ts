import { NextRequest, NextResponse } from 'next/server';
import FAQ from '@/models/FAQ';
import Notification from '@/models/notification';
import { dbConnect } from '@/lib/mongodb';
import { io } from 'server';


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { message, pythonResponse, userId } = await request.json();

    if (!message || !pythonResponse?.reply) {
      return NextResponse.json({
        saved: false,
        error: 'Données manquantes'
      }, { status: 200 });
    }

    const reply = pythonResponse.reply.trim();


    // 1DÉTECTION de la non-réponse du chatbot
    const NO_ANSWER_TEXT =
      "Je n’ai pas cette information dans ma base interne. Veuillez contacter l’administration";

    if (reply.includes(NO_ANSWER_TEXT)) {
      
      // Enregistrer dans MongoDB
      const notif = await Notification.create({
        type: "new-feedback",
        message: "Question sans réponse détectée",
        content: `Un employé a demandé : "${message}"`,
        read: false,
      });

      // ENVOI par WebSocket
      io.emit("admin_notification", {
        type: "new-feedback",
        message: "Nouvelle question sans réponse",
        content: message,
        date: new Date(),
      });

      console.log("🔔 Notification envoyée à l'admin");
    }

   //sauvegarde d FAQ
    const faq = new FAQ({
      question: message.trim(),
      reponse: reply,
      allReponses: [reply],
      source: 'chatbot',
      usageCount: 0,
      isActive: true,
      lastUsed: new Date(),
      confidence: 0.8,
      metadata: {
        userId: userId || 'anonymous',
        savedAt: new Date().toISOString(),
        from: 'chat'
      }
    });

    await faq.save();
    console.log('✅ FAQ sauvegardée - ID:', faq._id);

    return NextResponse.json({
      saved: true,
      id: faq._id
    });

  } catch (error: any) {
    console.error('❌ Erreur sauvegarde FAQ:', error.message);
    return NextResponse.json({
      saved: false,
      error: error.message
    }, { status: 200 });
  }
}
