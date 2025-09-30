import { JWT } from "next-auth/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWT;
  }
}
