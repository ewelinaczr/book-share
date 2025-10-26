import { FiUser } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export const navLinks = [
  { id: "home", name: "Home", path: "/home" },
  {
    id: "myBookshelf",
    name: "My Bookshelf",
    path: "/bookshelf",
  },
  {
    id: "pickUpPoints",
    name: "Pick Up Points",
    path: "/pickUpPoints",
  },
];
export const navIconLinks = [
  {
    id: "chat",
    name: "Chat",
    path: "/chat",
    icon: <BsEnvelope />,
  },
  {
    id: "profile",
    name: "Profile",
    path: "/profile",
    icon: <FiUser />,
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    icon: <IoSettingsOutline />,
  },
];
