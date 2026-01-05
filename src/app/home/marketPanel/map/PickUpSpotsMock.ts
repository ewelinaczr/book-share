import { CiCoffeeCup } from "react-icons/ci";
import { GiSpellBook } from "react-icons/gi";
import { GiBubblingBowl } from "react-icons/gi";
import { FaUniversity } from "react-icons/fa";
import { MdMuseum } from "react-icons/md";
import { PickUpSpot } from "@/interfaces/PickUpSpot";

export const pickUpSpots: PickUpSpot[] = [
  {
    icon: CiCoffeeCup,
    name: "The Reading Nook Café",
    adress: "Gdańsk, Długa 12",
    location: [54.3484202465462, 18.654439222913087],
    openingHours: "Monday-Sunday, 9:00-21:00",
    description:
      "Nestled in the heart of the Old Town, The Reading Nook Café is more than just a cozy coffee shop—it's a vibrant hub for book lovers and literary explorers. As one of the official pick-up points for the BookSwap app, it offers a warm and welcoming space to exchange stories.",
    features: [
      {
        name: "Secure Book Locker",
        description:
          "A dedicated shelf near the entrance where users can leave or pick up their borrowed books. Each book is tagged with a unique code for easy identification.",
      },
      {
        name: "Reader's Discount",
        description:
          "Show your BookSwap app and enjoy 15% off all drinks and pastries. Perfect for settling in with your new read.",
      },
      {
        name: "Reading Lounge",
        description:
          "Plush armchairs, soft lighting, and shelves lined with community-recommended titles. You’re welcome to stay and read as long as you like.",
      },
      {
        name: "Literary Events",
        description:
          "Weekly gatherings featuring author meetups, book reviews, poetry slams, and themed discussions. Check the event calendar in the app or on the café’s bulletin board.",
      },
      {
        name: "BookSwap Wall",
        description:
          "Snap a photo with your new book and pin it to the community wall. It’s a growing mosaic of readers and stories shared.",
      },
    ],
    color: "brown",
  },
  {
    icon: GiBubblingBowl,
    name: "Plot Twist Café",
    adress: "Gdańsk, Słowiańska 1",
    location: [54.42238350259881, 18.600295131020378],
    openingHours: "Monday-Sunday, 11:00-22:00",
    description:
      "Plot Twist Café is where stories unfold over steaming mugs and shared pages. Known for its cozy ambiance and literary flair, it's a unique pick-up spot where book lovers and foodies cross paths. Whether you're swapping novels or savoring a surprise dish, every visit promises a twist.",
    features: [
      {
        name: "Book Exchange Counter",
        description:
          "Located near the host stand, this counter allows for quick and easy book handovers between users.",
      },
      {
        name: "Plot Perk Deal",
        description:
          "Show your BookSwap app and get a free drink with any order when picking up a book.",
      },
      {
        name: "Author-Inspired Menu",
        description:
          "Seasonal dishes inspired by famous literary characters and authors. Try the 'Tolstoy Tofu' or 'Austen Apple Pie'.",
      },
      {
        name: "Weekend Read & Dine",
        description:
          "Every Saturday, enjoy a quiet reading hour with soft music and complimentary tea refills.",
      },
    ],
    color: "purple",
  },
  {
    icon: GiSpellBook,
    name: "Public Library",
    adress: "Gdańsk, Słowiańska 1",
    location: [54.40748092722532, 18.576469237383748],
    openingHours: "Monday-Friday, 8:00-18:00",
    description:
      "The Public Library is a natural home for book exchanges. With its vast collection and peaceful reading zones, it’s a trusted pick-up spot for BookSwap users who appreciate the quiet charm of traditional libraries.",
    features: [
      {
        name: "Designated BookSwap Shelf",
        description:
          "Located in the lobby, this shelf is reserved for BookSwap exchanges and monitored by library staff.",
      },
      {
        name: "Quiet Reading Rooms",
        description:
          "Pick up your book and dive into it immediately in one of the library’s serene reading rooms.",
      },
      {
        name: "Monthly Book Talks",
        description:
          "Join fellow readers for discussions on trending titles and community favorites.",
      },
      {
        name: "Children’s Story Hour",
        description:
          "Bring the little ones for a weekly storytelling session hosted by local volunteers.",
      },
    ],
    color: "orange",
  },
  {
    icon: FaUniversity,
    name: "Gdansk University",
    adress: "Gdańsk, Bażyńskiego 4",
    location: [54.38955517086517, 18.584265444483794],
    openingHours: "Monday-Friday, 7:30-20:00",
    description:
      "Gdansk University's campus is a dynamic pick-up spot for students and faculty alike. With its intellectual energy and open spaces, it’s a great place to exchange books and ideas.",
    features: [
      {
        name: "Campus BookSwap Station",
        description:
          "Located in the main atrium, this station allows for easy drop-off and pick-up between classes.",
      },
      {
        name: "Student Discount Perks",
        description:
          "Show your student ID and BookSwap app to receive discounts at campus cafés when picking up a book.",
      },
      {
        name: "Open-Air Reading Benches",
        description:
          "Scattered across the campus, these benches are perfect for enjoying your new book in the sun.",
      },
      {
        name: "Literature Club Events",
        description:
          "Join student-led book clubs and attend guest lectures from visiting authors.",
      },
    ],
    color: "LightCoral",
  },
  {
    icon: MdMuseum,
    name: "European Solidarity Centre",
    adress: "Gdańsk, Wałowa 27",
    location: [54.36142743239616, 18.649778827641217],
    openingHours: "Tuesday-Sunday, 10:00-18:00",
    description:
      "The European Solidarity Centre is a cultural landmark and a thoughtful pick-up spot for readers interested in history, activism, and social change. It’s a place where books spark dialogue and reflection.",
    features: [
      {
        name: "BookSwap Kiosk",
        description:
          "Located near the entrance, this kiosk is dedicated to book exchanges and includes a small reading nook.",
      },
      {
        name: "Exhibition Tie-Ins",
        description:
          "Pick up books related to current exhibitions and deepen your understanding of the topics.",
      },
      {
        name: "Discounted Museum Café",
        description:
          "Enjoy 10% off at the museum café when you pick up a book through BookSwap.",
      },
      {
        name: "Author Panels & Talks",
        description:
          "Attend special events featuring authors whose work intersects with themes of solidarity and justice.",
      },
    ],
    color: "Olive",
  },
];
