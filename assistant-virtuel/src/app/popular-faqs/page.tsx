// src/app/popular-faqs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { pythonChatService, PopularFAQ } from '@/lib/api/python-chat-service';
import Link from 'next/link';

export default function PopularFAQsPage() {
  const [popularFAQs, setPopularFAQs] = useState<PopularFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxUsage, setMaxUsage] = useState(1);

  useEffect(() => {
    loadPopularFAQs();
  }, []);

  const loadPopularFAQs = async () => {
    try {
      const faqs = await pythonChatService.getPopularFAQs(10);
      setPopularFAQs(faqs);
      
      // Trouver le maximum d'usage pour la progress bar
      if (faqs.length > 0) {
        const max = Math.max(...faqs.map(faq => faq.usageCount));
        setMaxUsage(max);
      }
    } catch (error) {
      console.error('Erreur chargement FAQs populaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (usageCount: number) => {
    return (usageCount / maxUsage) * 100;
  };

  const getProgressColor = (index: number) => {
    switch (index) {
      case 0: return 'from-red-500 to-orange-500';
      case 1: return 'from-blue-500 to-purple-500';
      case 2: return 'from-green-500 to-teal-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des questions populaires...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/chat" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <span>←</span>
            Retour au chat
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Questions les plus populaires
          </h1>
          <p className="text-gray-600">
            Découvrez les sujets les plus demandés par les employés
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {popularFAQs.length}
            </div>
            <div className="text-gray-600">Questions suivies</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {popularFAQs.reduce((sum, faq) => sum + faq.usageCount, 0)}
            </div>
            <div className="text-gray-600">Total d'utilisations</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {maxUsage}
            </div>
            <div className="text-gray-600">Record d'utilisation</div>
          </div>
        </div>

        {/* Top 3 avec Progress Bars */}
        {popularFAQs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🏆 Top 3 des questions
            </h2>
            <div className="space-y-4">
              {popularFAQs.slice(0, 3).map((faq, index) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>👆</span>
                            {faq.usageCount} utilisation{faq.usageCount > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🕒</span>
                            {new Date(faq.lastUsed).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Popularité</span>
                      <span>{faq.usageCount} / {maxUsage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(index)} transition-all duration-1000 ease-out`}
                        style={{ width: `${getProgressPercentage(faq.usageCount)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {faq.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste complète des FAQs populaires */}
        {popularFAQs.length > 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📈 Toutes les questions populaires
            </h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {popularFAQs.slice(3).map((faq, index) => (
                <div
                  key={faq._id}
                  className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === popularFAQs.slice(3).length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-semibold text-gray-500">
                          #{index + 4}
                        </span>
                        <h3 className="text-lg font-medium text-gray-800">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span>👆</span>
                          {faq.usageCount} utilisation{faq.usageCount > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🕒</span>
                          {new Date(faq.lastUsed).toLocaleDateString('fr-FR')}
                        </span>
                        {faq.tags && faq.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <span>🏷️</span>
                            {faq.tags.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Mini Progress Bar */}
                    <div className="w-24 ml-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"
                          style={{ width: `${getProgressPercentage(faq.usageCount)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si pas de données */}
        {popularFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune donnée de popularité disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Les statistiques de popularité apparaîtront après quelques utilisations du chatbot.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>💬</span>
              Commencer à utiliser le chat
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Les données sont mises à jour en temps réel à chaque utilisation du chatbot</p>
          <p className="mt-1">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}