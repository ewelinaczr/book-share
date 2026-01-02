import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    token?: string;
  }

  interface JWT {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string | null;
  }
}
