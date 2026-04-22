from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from unidecode import unidecode
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

print("✅ FAQ Processor – NLP amélioré (Top questions avec accents, pluriel et fuzzy)")

MIN_FREQUENCY = 2  # fréquence minimale pour être considéré
TOP_N = 3  # nombre maximum de questions dans le top

# -------------------------
# Liste des thèmes et mots-clés
# -------------------------
THEMES_ENTREPRISE = {
    'conges': ['conge', 'conges', 'vacances', 'repos', 'jour', 'jours'],
    'retard': ['retard', 'ponctualite', 'arrivee', 'tard', 'justifier'],
    'materiel_it': ['materiel', 'it', 'informatique', 'ordinateur', 'pc', 'equipement', 'outil'],
    'teletravail': ['teletravail', 'remote', 'domicile', 'a distance'],
    'rh': ['rh', 'ressources humaines', 'attestation', 'salaire', 'contrat', 'embauche', 'horaire'],
    'securite': ['securite', 'confidentialite', 'badge', 'acces', 'incident', 'nda'],
    'outils': ['outil', 'logiciel', 'slack', 'jira', 'github', 'notion', 'google workspace'],
    'vision_mission': ['vision', 'mission', 'valeur', 'valeurs', 'objectif', 'objectifs', 'entreprise'],
    'formation': ['formation', 'training', 'apprentissage', 'nouvel employe']
}

# -------------------------
# Normalisation et utils
# -------------------------


def normalize(text):
    """Normalise le texte : minuscules, suppression des accents et des caractères spéciaux"""
    text = unidecode(text.lower())
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()


def singular(word):
    """Transforme pluriel → singulier simplifié"""
    if word.endswith('s') and len(word) > 3:
        return word[:-1]
    return word


def similar(a, b):
    """Retourne un score de similarité entre 0 et 1"""
    return SequenceMatcher(None, a, b).ratio()

# -------------------------
# Détection du thème
# -------------------------


def detecter_theme_question(question):
    question_norm = normalize(question)
    scores = {}

    for theme, mots_cles in THEMES_ENTREPRISE.items():
        score = 0
        for mot in mots_cles:
            mot_norm = singular(normalize(mot))
            for q_mot in question_norm.split():
                q_mot_norm = singular(q_mot)
                if similar(mot_norm, q_mot_norm) > 0.85:
                    score += 1
                    if len(mot_norm) > 5:
                        score += 1
        if score > 0:
            scores[theme] = score

    if scores:
        return max(scores.items(), key=lambda x: x[1])[0]
    return 'autre'

# -------------------------
# Choisir représentant basé sur la meilleure correspondance mots-clés
# -------------------------


def choisir_representant(q_groupe, theme):
    mots_cles = THEMES_ENTREPRISE.get(theme, [])
    best_q = max(
        q_groupe,
        key=lambda q: max(
            (similar(singular(normalize(q_mot)), singular(normalize(mot)))
             for mot in mots_cles
             for q_mot in q.split()),
            default=0  # ← ajout de default=0 pour éviter l'erreur
        )
    )
    return best_q


# -------------------------
# API Endpoint
# -------------------------
@app.route('/process-faqs', methods=['POST'])
def process_faqs():
    data = request.json
    questions = data.get('questions', [])

    if not questions:
        return jsonify({
            'topQuestions': [],
            'maxAllowed': TOP_N,
            'totalProcessed': 0,
            'model': 'entreprise-theme-detection'
        })

    # Détection des thèmes pour chaque question
    themes_detectes = [(q, detecter_theme_question(q)) for q in questions]

    # Regrouper par thème
    groupes = {}
    for q, theme in themes_detectes:
        if theme not in groupes:
            groupes[theme] = []
        groupes[theme].append(q)

    # Calculer les fréquences et questions représentatives
    stats_groupes = []
    for theme, q_groupe in groupes.items():
        frequence = len(q_groupe)
        representant = choisir_representant(q_groupe, theme)
        stats_groupes.append({
            'theme': theme,
            'frequency': frequence,
            'representative': representant,
            'questions': q_groupe
        })

    # Trier par fréquence décroissante
    stats_groupes.sort(key=lambda x: x['frequency'], reverse=True)

    # Prendre les top N
    top = stats_groupes[:TOP_N]
    top_questions = [item['representative'] for item in top]

    # Détails pour chaque groupe
    details = []
    for item in top:
        details.append({
            'theme': item['theme'],
            'frequency': item['frequency'],
            'representative': item['representative'],
            'examples': item['questions'][:3]
        })

    return jsonify({
        'topQuestions': top_questions,
        'maxAllowed': TOP_N,
        'totalProcessed': len(questions),
        'groupsFound': len(stats_groupes),
        'groupDetails': details,
        'model': 'entreprise-theme-detection'
    })

# -------------------------
# Health check
# -------------------------


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model': 'entreprise-theme-detection',
        'maxAllowed': TOP_N
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
