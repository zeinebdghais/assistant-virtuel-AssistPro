// src/lib/api/faq-service.ts
import FAQ from '@/models/FAQ';
import { dbConnect } from '@/lib/mongodb';

export class FAQService {
  private static instance: FAQService;

  private constructor() {}

  static getInstance(): FAQService {
    if (!FAQService.instance) {
      FAQService.instance = new FAQService();
    }
    return FAQService.instance;
  }

  // ✅ NOTE: La sauvegarde automatique se fait maintenant dans api/chat/route.ts
  // Cette méthode est pour les sauvegardes manuelles si besoin
  async saveChatbotFAQ(
    userQuestion: string, 
    botResponse: string, 
    allResponses?: string[],
    confidence: number = 0.8
  ) {
    try {
      console.log('🔄 Sauvegarde manuelle FAQ:', userQuestion);
      
      await dbConnect();

      const existingFAQ = await FAQ.findOne({
        question: { $regex: userQuestion.substring(0, 20), $options: 'i' }
      });

      if (existingFAQ) {
        const currentAllReponses = existingFAQ.allReponses || [];
        const currentConfidence = existingFAQ.confidence || 0;
        const currentUsageCount = existingFAQ.usageCount || 0;
        
        existingFAQ.usageCount = currentUsageCount + 1;
        existingFAQ.lastUsed = new Date();
        existingFAQ.confidence = Math.max(currentConfidence, confidence);
        
        if (botResponse && !currentAllReponses.includes(botResponse)) {
          existingFAQ.allReponses = [...currentAllReponses, botResponse];
        }
        
        await existingFAQ.save();
        
        console.log('✅ FAQ mise à jour:', userQuestion);
        return { 
          success: true, 
          message: 'FAQ mise à jour',
          faq: existingFAQ 
        };
      }

      const newFAQ = new FAQ({
        question: userQuestion.trim(),
        reponse: botResponse.trim(),
        allReponses: allResponses || [botResponse.trim()],
        source: 'chatbot',
        confidence: confidence,
        usageCount: 1,
        lastUsed: new Date(),
        tags: ['auto-generated', 'chatbot'],
        isActive: true
      });

      await newFAQ.save();

      console.log('✅ NOUVELLE FAQ sauvegardée:', userQuestion);
      return {
        success: true,
        message: 'FAQ sauvegardée avec succès',
        faq: newFAQ
      };

    } catch (error) {
      console.error('❌ Erreur sauvegarde FAQ:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  async getPopularFAQs(limit: number = 10) {
    try {
      await dbConnect();
      const faqs = await FAQ.find({ isActive: true })
        .sort({ usageCount: -1, lastUsed: -1 })
        .limit(limit);
      return faqs;
    } catch (error) {
      console.error('Erreur récupération FAQs populaires:', error);
      return [];
    }
  }

  async getFAQStats() {
    try {
      await dbConnect();
      const totalFAQs = await FAQ.countDocuments();
      const activeFAQs = await FAQ.countDocuments({ isActive: true });
      const chatbotFAQs = await FAQ.countDocuments({ source: 'chatbot' });
      const totalUsage = await FAQ.aggregate([
        { $group: { _id: null, totalUsage: { $sum: '$usageCount' } } }
      ]);
      
      return {
        totalFAQs,
        activeFAQs,
        chatbotFAQs,
        totalUsage: totalUsage[0]?.totalUsage || 0
      };
    } catch (error) {
      console.error('Erreur statistiques FAQ:', error);
      return null;
    }
  }
}

export const faqService = FAQService.getInstance();