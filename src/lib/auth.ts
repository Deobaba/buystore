import jwt from "jsonwebtoken";
import UserModel, { User } from "@/lib/user";

export const authenticateUser = async (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await UserModel.findById(decoded.id).lean();
    return user as User | null;
  } catch (error) {
    return null;
  }
};
