import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Récupération des champs envoyés pour login
        const { email, password } = await req.json();

        // Vérification des champs requis
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe sont requis" },
                { status: 400 }
            );
        }

        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Identifiants invalides" },
                { status: 401 }
            );
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Identifiants invalides" },
                { status: 401 }
            );
        }

        // Création du token JWT avec les infos nécessaires
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // Réponse avec le token et tous les attributs du user (sauf le mot de passe)
        return NextResponse.json({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
                numTelephone: user.numTelephone,
                poste: user.poste,
                salaire: user.salaire,
                dateEmbauche: user.dateEmbauche
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erreur interne du serveur",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
