import mammoth
from PyPDF2 import PdfReader
from docx import Document
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
from pptx import Presentation
# from flask import Flask, request, jsonify
# from flask_cors import CORS
import re
from unidecode import unidecode
from difflib import SequenceMatcher


load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def load_prompt(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


BASE_PROMPT = {
    "system": load_prompt("prompts/system.txt"),
    "company": load_prompt("prompts/company.txt"),
    "hr": load_prompt("prompts/hr.txt"),
    "it": load_prompt("prompts/it.txt"),
    "security": load_prompt("prompts/security.txt"),
    "faq": load_prompt("prompts/faq.txt"),
    "style": load_prompt("prompts/style.txt"),
    "doc": load_prompt("prompts/doc.txt"),
}


def build_final_prompt(user_message):
    return f"""
### SYSTEM
{BASE_PROMPT['system']}

### COMPANY PROFILE
{BASE_PROMPT['company']}

### HR RULES
{BASE_PROMPT['hr']}

### IT RULES
{BASE_PROMPT['it']}

### SECURITY RULES
{BASE_PROMPT['security']}

### FAQ DATABASE
{BASE_PROMPT['faq']}

### STYLE GUIDE
{BASE_PROMPT['style']}

### USER QUESTION
{user_message}
"""


@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "")
    final_prompt = build_final_prompt(user_msg)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": BASE_PROMPT["system"]},
                {"role": "user", "content": final_prompt}
            ],
            temperature=0.4
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ Backend Error:", e)
        return jsonify({"error": str(e)}), 500


def extract_text(file_path, file_type):
    try:
        if file_type == "pdf":
            reader = PdfReader(file_path)
            return "".join([page.extract_text() or "" for page in reader.pages])

        elif file_type == "docx":
            doc = Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])

        elif file_type == "txt":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()

        elif file_type == "csv":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()

        elif file_type == "doc":
            with open(file_path, "rb") as f:
                result = mammoth.extract_raw_text(f)
                return result.value

        elif file_type == "pptx":
            prs = Presentation(file_path)
            text_content = []

            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        text_content.append(shape.text)

            return "\n".join(text_content)

    except Exception as e:
        print("Erreur extraction PPTX :", e)

    return ""


MAX_CHUNK_SIZE = 100000


def chunk_text(text, chunk_size=MAX_CHUNK_SIZE):
    words = text.split()
    chunks = []
    current_chunk = []
    current_len = 0

    for word in words:
        current_chunk.append(word)
        current_len += len(word) + 1

        if current_len >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_len = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def summarize_text(text):
    prompt = f"""
    ### SYSTEM
    Tu es un assistant virtuel d’entreprise spécialisé dans les résumés.

    ### TASK
    Résume le texte suivant de façon claire, concise et structurée :

    {text}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    return response.choices[0].message.content


# -----------------------------------------------------
#   ROUTE UPLOAD
# -----------------------------------------------------

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "Aucun fichier reçu"}), 400

    filename = file.filename.lower()

    # Extensions supportées
    extension_map = {
        ".pdf": "pdf",
        ".docx": "docx",
        ".doc": "doc",
        ".txt": "txt",
        ".csv": "csv",
        ".pptx": "pptx",
    }

    file_type = None
    for ext, ftype in extension_map.items():
        if filename.endswith(ext):
            file_type = ftype
            break

    if not file_type:
        return jsonify({
            "error": "Désolé, je ne peux traiter que les fichiers "
                     "PPTX, PDF, DOCX, DOC, TXT ou CSV."
        }), 400

    # Sauvegarde temporaire
    temp_path = f"temp_{filename}"
    file.save(temp_path)

    # Extraction texte
    text = extract_text(temp_path, file_type)
    if not text.strip():
        os.remove(temp_path)
        return jsonify({"error": "Impossible d'extraire le texte"}), 400

    # Découpage + résumé
    chunks = chunk_text(text)
    summaries = [summarize_text(chunk) for chunk in chunks]
    final_summary = "\n\n".join(summaries)

    os.remove(temp_path)

    return jsonify({"summary": final_summary})

# --FAQ---#################################################""


# app = Flask(__name__)
# CORS(app)

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


if __name__ == "__main__":
    app.run(port=5000, debug=True)
