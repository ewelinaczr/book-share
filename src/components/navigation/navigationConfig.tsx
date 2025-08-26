import { IoNotificationsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { Abril_Fatface } from "next/font/google";

export const navLinks = [
  { name: "Home", path: "home" },
  { name: "My Bookshelf", path: "bookshelf" },
  { name: "Browse", path: "browse" },
  { name: "Recommendations", path: "recommendations" },
];
export const navIconLinks = [
  {
    name: "Notifications",
    path: "notifications",
    icon: <IoNotificationsOutline />,
  },
  { name: "Messages", path: "messages", icon: <BsEnvelope /> },
  { name: "Profile", path: "profile", icon: <FiUser /> },
];

export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
