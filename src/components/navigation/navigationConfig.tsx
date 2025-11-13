import { FiUser } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export const navLinks = [
  { id: "home", name: "Home", path: "/home", onboardingId: "nextstep-step2" },
  {
    id: "myBookshelf",
    name: "My Bookshelf",
    path: "/bookshelf",
    onboardingId: "nextstep-step3",
  },
  {
    id: "pickUpPoints",
    name: "Pick Up Points",
    path: "/pickUpPoints",
    onboardingId: "nextstep-step4",
  },
];
export const navIconLinks = [
  {
    id: "chat",
    name: "Chat",
    path: "/chat",
    icon: <BsEnvelope />,
    onboardingId: "nextstep-step5",
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
