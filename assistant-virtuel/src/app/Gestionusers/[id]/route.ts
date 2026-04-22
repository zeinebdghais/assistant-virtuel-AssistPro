import { dbConnect } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

// GET one user
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params est un Promise
) {
  const { id } = await context.params; // 👈 il faut await
  await dbConnect();
  const user: IUser | null = await User.findById(id);
  return Response.json(user);
}

// PUT update user
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();
  const data = await req.json();
  const user: IUser | null = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return Response.json(user);
}

// DELETE user
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();
  await User.findByIdAndDelete(id);
  return Response.json({ message: "Utilisateur supprimé ✅" });
}