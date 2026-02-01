import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if not authenticated
  },
});

export const config = {
  matcher: [
    "/requests/:path*",
    "/bookshelf/:path*",
    "/market/mine/:path*",
    "/chat/:path*",
    "/pickUpPoints/:path*",
    "/profile/:path*",
  ],
};
