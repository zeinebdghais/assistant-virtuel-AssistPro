"use client";

import { useRouter } from "next/navigation";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  MessageSquare,
  HelpCircle,
  Bell,
  CheckCircle,
  LucideIcon,
  Bot,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UserDetails {
  nom: string;
  prenom: string;
  avatar?: string;
  _id?: string;
}
interface Feedback {
  _id: string;
  content: string;
  note: number;
  dateFeedback: string;
  userId?: UserDetails;
  status: "Examiné" | "En attente";
}

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  badge?: boolean;
}

interface StatBlockProps {
  Icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  initial?: string;
}

export default function Home() {
  const router = useRouter();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const handleStart = () => {
    router.push("/login");
  };

  // Fonction pour assigner les refs
  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const fetchFeedbacks = async (userId: string) => {
    try {
      const res = await fetch(`/api/feedback/`);
      if (!res.ok) throw new Error("Erreur récupération feedbacks");
      const data: Feedback[] = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Animation au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    fetchFeedbacks("");

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const FeatureCard: React.FC<FeatureCardProps> = ({
    Icon,
    title,
    description,
    badge = false,
  }) => (
    <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      {badge && (
        <span className="mb-3 text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
          <Sparkles className="w-3 h-3 mr-1" /> Propulsé par l'Intelligence
          Artificielle
        </span>
      )}
      <div className="p-3 bg-slate-50 text-blue-600 rounded-full mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-xl font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );

  const StatBlock: React.FC<StatBlockProps> = ({
    Icon,
    value,
    label,
    className = "",
  }) => (
    <div
      className={`p-6 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <div className="text-4xl font-bold text-slate-900 flex items-center mb-2">
        <Icon className="w-6 h-6 mr-2 text-blue-600" />
        {value}
      </div>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );

  const TestimonialCard: React.FC<TestimonialCardProps> = ({
    quote,
    name,
    title,
    initial = "A",
  }) => (
    <div className="p-8 rounded-xl bg-white shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="flex text-amber-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 italic mb-6">"{quote}"</p>
      <div className="flex items-center mt-auto">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-3">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Styles CSS pour les animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .btn-hover-animation {
          transition: all 0.3s ease;
        }

        .btn-hover-animation:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="w-full px-8 md:px-16 py-4 flex justify-between items-center fixed top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-500 shadow-xl rounded-2xl mr-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AssistPro
          </h1>
        </div>

        <div className="hidden md:flex gap-8 text-base font-medium text-slate-600">
          <a
            href="#features"
            className="hover:text-blue-700 transition-colors duration-300"
          >
            Fonctionnalités
          </a>
          <a
            href="#testimonials"
            className="hover:text-blue-700 transition-colors duration-300"
          >
            Témoignages
          </a>
        </div>

        <button
          onClick={handleStart}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 shadow-xl text-white text-sm font-medium btn-hover-animation flex items-center"
        >
          Se connecter <span className="ml-2">→</span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Assistant Virtuel{" "}
              <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
                Intelligent
              </span>{" "}
              pour Entreprise
            </h1>
            <p className="mt-4 text-base text-slate-600 max-w-lg">
              Optimisez la communication interne grâce à l'IA. Répondez aux
              questions de vos employés 24/7 et améliorez leur productivité.
            </p>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleStart}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 shadow-xl hover:bg-blue-700 text-white text-sm font-semibold btn-hover-animation flex items-center"
              >
                Commencer maintenant <span className="ml-2">→</span>
              </button>
              <a
                href="#features"
                className="px-6 py-2.5 rounded-xl bg-white text-black border border-gray-400 text-sm font-semibold hover:bg-blue-50 transition-all hover:-translate-y-1"
              >
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border-2 border-blue-50 animate-float">
              <div className="absolute -top-7 -right-7 p-2 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-emerald-500/70" />
              </div>
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-500 shadow-xl rounded-2xl mr-3">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Assistant IA</p>
                  <p className="text-xs text-emerald-500 font-medium">
                    ● En ligne
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-start items-start">
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="max-w-[80%] p-3 bg-gray-100 rounded-b-xl rounded-tr-xl text-sm text-gray-800">
                    Bonjour ! Comment puis-je vous aider aujourd'hui ?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 bg-blue-600 shadow-xl rounded-t-xl rounded-bl-xl text-sm text-white">
                    Quel est le processus de demande de congés ?
                  </div>
                </div>

                <div className="flex justify-start items-start">
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="max-w-[80%] p-3 bg-gray-100 rounded-b-xl rounded-tr-xl text-sm text-gray-800">
                    Pour demander des congés, rendez-vous sur le portail RH,
                    section "Mes congés". Remplissez le formulaire et
                    soumettez-le à votre manager.
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-7 p-2 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* FONCTIONNALITÉS I */}
      <section id="features" ref={setSectionRef(0)} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-12">
            Fonctionnalités{" "}
            <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
              Puissantes
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              Icon={MessageSquare}
              title="Chat Intelligent"
              description="Communiquez en temps réel avec notre assistant IA pour obtenir des réponses instantanées."
            />
            <FeatureCard
              Icon={HelpCircle}
              title="FAQ Automatisée"
              description="Accédez à une base de connaissances intelligente qui apprend de vos questions."
            />
            <FeatureCard
              Icon={Bell}
              title="Notifications Internes"
              description="Restez informé des dernières actualités et mises à jour de votre entreprise."
            />
            <FeatureCard
              Icon={Star}
              title="Feedback Rapide"
              description="Partagez vos retours et suggestions pour améliorer l'expérience de tous."
            />
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* POURQUOI CHOISIR ASSISTPRO ? */}
      <section ref={setSectionRef(1)} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="lg:pr-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
              Pourquoi choisir{" "}
              <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
                AssistPro
              </span>{" "}
              ?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Réponses instantanées 24h/24, 7j/7
              </li>
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Intégration simple avec vos outils existants
              </li>
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Apprentissage continu basé sur vos données
              </li>
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Tableau de bord analytics détaillé
              </li>
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Support multilingue
              </li>
              <li className="flex items-start text-lg text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                Sécurité des données garantie
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <StatBlock
              Icon={Zap}
              value="5x"
              label="Plus rapide que le support traditionnel"
              className="border-t-4 border-blue-500"
            />
            <StatBlock
              Icon={ShieldCheck}
              value="100%"
              label="Conformité RGPD"
              className="border-t-4 border-blue-500"
            />
            <StatBlock
              Icon={Star}
              value="4.9/5"
              label="Note utilisateurs"
              className="border-t-4 border-blue-400"
            />
            <StatBlock
              Icon={Zap}
              value="-60%"
              label="Tickets support réduits"
              className="border-t-4 border-blue-500"
            />
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* TÉMOIGNAGES CLIENTS */}
      <section
        id="testimonials"
        ref={setSectionRef(2)}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Ce que nos clients{" "}
            <span className="bg-gradient-to-r from-[#3A6FF8] to-[#27DDB6] bg-clip-text text-transparent">
              disent
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            Des centaines d'entreprises nous font confiance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.slice(0, 3).map((fb) => (
              <TestimonialCard
                key={fb._id}
                quote={fb.content}
                name={
                  fb.userId
                    ? `${fb.userId.prenom} ${fb.userId.nom}`
                    : "Utilisateur"
                }
                title={`Note : ${fb.note}/5`}
                initial={
                  fb.userId ? `${fb.userId.prenom[0]}${fb.userId.nom[0]}` : "U"
                }
              />
            ))}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AssistPro a révolutionné notre communication interne. Les réponses sont instantanées et précises."
              name="Sophie Martin"
              title="Directrice RH"
              initial="SM"
            />
            <TestimonialCard
              quote="Un gain de temps incroyable ! Je trouve toutes les informations dont j'ai besoin en quelques secondes."
              name="Thomas Bernard"
              title="Chef de Projet"
              initial="TB"
            />
            <TestimonialCard
              quote="L'intégration a été simple et l'équipe support est très réactive. Excellent outil !"
              name="Claire Dubois"
              title="Responsable IT"
              initial="CD"
            />
          </div> */}
        </div>
      </section>

      {/* CALL-TO-ACTION */}
      <section ref={setSectionRef(3)} className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-8 md:px-16">
          <div className="p-10 md:p-16 rounded-3xl text-center text-white bg-gradient-to-r from-blue-600 to-emerald-600 shadow-xl hover:shadow-2xl ">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre communication interne ?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Rejoignez les entreprises qui ont déjà adopté AssistPro pour
              améliorer leur productivité.
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-3 rounded-2xl bg-white text-black text-base font-semibold shadow-2xl hover:bg-gray-100 transition-all btn-hover-animation flex items-center justify-center mx-auto"
            >
              Commencer gratuitement <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center text-sm text-slate-500">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-500 shadow-xl rounded-2xl mr-3">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AssistPro
            </h1>
          </div>
          <p>© 2025 Entreprise. Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
