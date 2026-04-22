import { dbConnect } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";

// GET all users
export async function GET() {
  await dbConnect();
  const users: IUser[] = await User.find();
  return Response.json(users);
}

// POST new user with hashed password
export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();

    // Vérifier que le mot de passe est présent
    if (!data.password) {
      return Response.json(
        { error: "Le mot de passe est requis" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Remplacer le mot de passe original par le hashé
    const newUserData = {
      ...data,
      password: hashedPassword,
    };

    // Créer l'utilisateur dans MongoDB
    const user = await User.create(newUserData);

    return Response.json(
      { message: "Utilisateur ajouté avec succès", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
