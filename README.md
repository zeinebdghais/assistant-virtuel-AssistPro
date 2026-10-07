# 🤖 Assist Pro — Assistant Virtuel Intelligent

## 📌 Description

**Assist Pro** est un assistant virtuel intelligent destiné à faciliter la communication et l’accès aux informations au sein d’une entreprise.

L’application permet aux employés d’interagir avec un assistant basé sur l’**Intelligence Artificielle** afin d’obtenir rapidement des réponses à leurs questions, tandis que les administrateurs disposent d’un espace permettant de gérer les utilisateurs, les conversations et les fonctionnalités de la plateforme.

Le projet combine une **interface web moderne**, une **API backend**, une **base de données MongoDB** et un **modèle de langage (LLM)** pour fournir une expérience conversationnelle intelligente.

---

## 🎯 Objectifs du projet

Les principaux objectifs d’Assist Pro sont :

* 🤖 Fournir un assistant conversationnel intelligent aux employés.
* 💬 Permettre des échanges naturels avec l’assistant IA.
* 🔐 Gérer les utilisateurs et leurs rôles.
* 👨‍💼 Fournir un espace d’administration.
* 🔔 Gérer les notifications en temps réel.
* 📊 Centraliser les informations et les interactions des utilisateurs.
* ⚡ Fournir des réponses rapides et pertinentes grâce à l’IA.

---

## ✨ Fonctionnalités

### 👤 Employé

* Authentification et accès sécurisé.
* Interaction avec l’assistant virtuel.
* Envoi et réception de messages.
* Consultation de l’historique des conversations.
* Réception de notifications en temps réel.

### 👨‍💼 Administrateur

* Gestion des utilisateurs.
* Gestion des rôles et des accès.
* Consultation des activités et conversations.
* Gestion des notifications.
* Accès aux fonctionnalités d’administration.

### 🤖 Intelligence Artificielle

* Compréhension des requêtes en langage naturel.
* Génération de réponses grâce à un modèle LLM.
* Traitement conversationnel.
* Intégration d’un service d’IA indépendant du frontend.

---

## 🏗️ Architecture

L'application repose sur une architecture séparant le frontend, le backend et les services d'intelligence artificielle.

```text
                         ┌──────────────────────┐
                         │      Utilisateur     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Frontend        │
                         │ Next.js + TypeScript │
                         └──────────┬───────────┘
                                    │
                           HTTP / WebSocket
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │      Flask API       │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
           ┌─────────────────┐                ┌─────────────────┐
           │    MongoDB      │                │   Service IA    │
           │    Database     │                │      LLM        │
           └─────────────────┘                └─────────────────┘
```

---

## 🛠️ Technologies utilisées

### Frontend

* **Next.js**
* **TypeScript**
* **React**
* **Tailwind CSS**
* **shadcn/ui**
* **Framer Motion**
* **Lucide Icons**

### Backend

* **Python**
* **Flask**
* **REST API**
* **Socket.IO**

### Base de données

* **MongoDB**

### Intelligence Artificielle

* **LLM**
* **Groq API**
* **Llama 3.3 70B**

---

## ⚙️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

* **Node.js**
* **npm**
* **Python 3.x**
* **MongoDB**
* Une clé API **Groq**

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/zeinebdghais/assistant-virtuel.git
cd assistant-virtuel
```

### 2. Installer les dépendances frontend

```bash
npm install
```

### 3. Installer les dépendances backend

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

Créer un fichier `.env` et renseigner les paramètres nécessaires :

```env
MONGODB_URI=mongodb://localhost:27017/assist_pro
GROQ_API_KEY=your_groq_api_key
```

Ajouter également les autres variables nécessaires à la configuration du projet.

---

## ▶️ Lancement du projet

### Démarrer le backend

```bash
python app.py
```

### Démarrer le frontend

Dans un autre terminal :

```bash
npm run dev
```

L'application sera ensuite accessible à l'adresse :

```text
http://localhost:3000
```

---

## 🤖 Service d'intelligence artificielle

Le système utilise **Groq** pour communiquer avec un modèle de langage **Llama 3.3 70B**.

Le frontend envoie la requête de l'utilisateur au backend. Le backend traite la demande et communique avec le service IA avant de retourner la réponse à l'utilisateur.

```text
Utilisateur
     │
     ▼
Interface Next.js
     │
     ▼
API Flask
     │
     ▼
Service IA
     │
     ▼
Llama 3.3 70B
     │
     ▼
Réponse
     │
     ▼
Utilisateur
```

---

## 🔐 Sécurité

Les informations sensibles doivent être stockées dans des variables d'environnement et ne doivent pas être publiées dans le dépôt.

Exemple :

```env
GROQ_API_KEY=********
MONGODB_URI=********
```

Le fichier `.env` doit être ajouté au `.gitignore`.

---

## 📌 Équipe et encadrement

**Projet :** Assist Pro — Assistant Virtuel Intelligent

**Technologies principales :** Next.js, TypeScript, Flask, MongoDB, IA

**Encadrement :** Mme Nessrine Meddeb

---

## 📄 Licence

Ce projet a été réalisé dans le cadre d'un projet académique.
