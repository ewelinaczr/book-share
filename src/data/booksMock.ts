import Book from "@/interfaces/Book";

const booksMock: Book[] = [
  {
    _id: "68454430072121db29b05d08",
    id: "OEBPSAAAQBAJ",
    volumeInfo: {
      title: "Harry Potter and the Sorcerer's Stone",
      authors: ["J.K. Rowling"],
      publisher: "Pottermore Publishing",
      publishedDate: "2015-12-08",
      description: "Harry Potter has never even heard of Hogwarts...",
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "1781100489" },
        { type: "ISBN_13", identifier: "9781781100486" },
      ],
      pageCount: 309,
      categories: ["Juvenile Fiction"],
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=OEBPSAAAQBAJ&printsec=frontcover&img=1&zoom=5",
        thumbnail:
          "http://books.google.com/books/content?id=OEBPSAAAQBAJ&printsec=frontcover&img=1&zoom=1",
      },
      language: "en",
      averageRating: 4.5,
      ratingsCount: 12345,
    },
  },
  {
    _id: "68454430072121db29b05d09",
    id: "1EXQ0AEACAAJ",
    volumeInfo: {
      title: "Diuna",
      authors: ["Frank Herbert"],
      publishedDate: "2024",
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "8383381360" },
        { type: "ISBN_13", identifier: "9788383381367" },
      ],
      pageCount: 0,
      categories: ["Fiction"],
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=4kbYExSCa6oC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=4kbYExSCa6oC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      averageRating: 4.22,
      ratingsCount: 565,
      description:
        "Get excited for the 2021 Denis Villeneuve Dune film release, starring Timothée Chalamet, with The Science of Dune! Since its original publication in 1965, the Dune series has entranced generations of readers with its complex plotting, fascinating characters, grand scope, and incredible scientific predictions. This guide offers fascinating scientific speculation on topics including quantum physics, biochemistry, ecology, evolution, psychology, technology, and genetics. It scrutinizes Frank Herbert’s science fiction world by asking questions such as: Is the ecology of Dune realistic? Is it theoretically possible to get information from the future? Could humans really evolve as Herbert suggests? Which of Herbert’s inventions have already come to life? This companion is a must-have for any fan who wants to revisit the world of Dune and explore it even further.",
      language: "en",
    },
  },
  {
    _id: "2",
    id: "7600",
    volumeInfo: {
      title: "One Hundred Years Of Solitude",
      authors: ["Gabriel García Márquez"],
      publisher: "Everyman",
      publishedDate: "1995-09-21",
      averageRating: 4.07,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "1857152239" },
        { type: "ISBN_13", identifier: "9781857152234" },
      ],
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=IlAnEQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=IlAnEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "eng",
      pageCount: 416,
      ratingsCount: 376,
      description: undefined,
    },
  },
  {
    _id: "3",
    id: "31",
    volumeInfo: {
      title: "The Count of Monte Cristo",
      authors: ["Alexandre Dumas", "Lorenzo Carcaterra"],
      publisher: "Modern Library",
      publishedDate: "2002-06-11",
      averageRating: 4.25,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "037576030X" },
        { type: "ISBN_13", identifier: "9780375760303" },
      ],
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=s6gGaHHYu6gC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=s6gGaHHYu6gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "eng",
      pageCount: 1462,
      ratingsCount: 3769921,
      description: undefined,
    },
  },
  {
    _id: "4",
    id: "42430",
    volumeInfo: {
      title: "Dune (Dune #1)",
      authors: ["Frank Herbert", "Domingo Santos"],
      publisher: "Debolsillo",
      publishedDate: "2003-10-30",
      averageRating: 4.22,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "849759682X" },
        { type: "ISBN_13", identifier: "9788497596824" },
      ],
      language: "spa",
      pageCount: 702,
      ratingsCount: 565,
      description: undefined,
    },
  },
  {
    _id: "5",
    id: "424313750",
    volumeInfo: {
      title: "The Iliad/The Odyssey",
      authors: ["Homer", "Robert Fagles", "Bernard Knox"],
      publisher: "Penguin Classics",
      publishedDate: "1999-11-01",
      averageRating: 4.04,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0147712556" },
        { type: "ISBN_13", identifier: "9780147712554" },
      ],
      language: "eng",
      pageCount: 7021556,
      ratingsCount: 54939,
      description: undefined,
    },
  },
  {
    _id: "6",
    id: "1888",
    volumeInfo: {
      title: "Pride and Prejudice",
      authors: ["Jane Austenx"],
      publisher: "Oxford University Press",
      publishedDate: "2004-02-11",
      averageRating: 4.26,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0192802380" },
        { type: "ISBN_13", identifier: "9780192802385" },
      ],
      language: "eng",
      pageCount: 333,
      ratingsCount: 2399,
      description: undefined,
    },
  },
  {
    _id: "7",
    id: "38648",
    volumeInfo: {
      title: "The Little Princesses",
      authors: ["Marion Crawford", "Jennie Bond"],
      publisher: "St. Martin's Press",
      publishedDate: "2003-04-10",
      averageRating: 4.03,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0312312156" },
        { type: "ISBN_13", identifier: "9780312312152" },
      ],
      language: "eng",
      pageCount: 23033,
      ratingsCount: 416,
      description: undefined,
    },
  },
  {
    _id: "8",
    id: "43504",
    volumeInfo: {
      title: "Harry Potter and the Philosopher's Stone (Harry Potter  #1)",
      authors: ["J.K. Rowling"],
      publisher: "Bloomsbury USA Childrens",
      publishedDate: "2010-07-01",
      averageRating: 4.47,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "158234681X" },
        { type: "ISBN_13", identifier: "9781582346816" },
      ],
      language: "gla",
      pageCount: 23033,
      ratingsCount: 250,
      description: undefined,
    },
  },
  {
    _id: "9",
    id: "104",
    volumeInfo: {
      title: "The Handmaid's Tale",
      authors: ["Margaret Atwood"],
      publisher: "Heinemann Library",
      publishedDate: "2009-09-01",
      averageRating: 4.11,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0435124099" },
        { type: "ISBN_13", identifier: "9780435124090" },
      ],
      language: "en-GB",
      pageCount: 308,
      ratingsCount: 529,
      description: undefined,
    },
  },
  {
    _id: "10",
    id: "5477",
    volumeInfo: {
      title: "1984",
      authors: ["George Orwell", "Erich Fromm"],
      publisher: "Signet Classics",
      publishedDate: "1981-07-01",
      averageRating: 4.18,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0451516753" },
        { type: "ISBN_13", identifier: "9780451516756" },
      ],
      language: "eng",
      pageCount: 268,
      ratingsCount: 1322,
      description: undefined,
    },
  },
  {
    _id: "11",
    id: "722",
    volumeInfo: {
      title: "Alice's Adventures in Wonderland & Through the Looking-Glass",
      authors: ["Lewis Carroll", "John Tenniel"],
      publisher: "Bantam Classics",
      publishedDate: "1984-05-01",
      averageRating: 4.07,
      industryIdentifiers: [
        { type: "ISBN_10", identifier: "0553213458" },
        { type: "ISBN_13", identifier: "9780553213454" },
      ],
      language: "eng",
      pageCount: 234,
      ratingsCount: 1469,
      description: undefined,
    },
  },
  {
    _id: "12",
    id: "s6gGaHHYu6gC",
    volumeInfo: {
      title: "Alice's Adventures In Wonderland",
      authors: ["Lewis Carroll"],
      publisher: "Jazzybee Verlag",
      publishedDate: "2012",
      description:
        "This is the extended and annotated edition including * an extensive biographical annotation about the author and his life * all the original illustrations * two rare essays about Alice and her meaning for Carroll's life Alice's Adventures in Wonderland (commonly shortened to Alice in Wonderland) is an 1865 novel written by English author Charles Lutwidge Dodgson under the pseudonym Lewis Carroll. It tells of a girl named Alice who falls down a rabbit hole into a fantasy world (Wonderland) populated by peculiar, anthropomorphic creatures. The tale plays with logic, giving the story lasting popularity with adults as well as children. It is considered to be one of the best examples of the literary nonsense genre, and its narrative course and structure, characters and imagery have been enormously influential in both popular culture and literature, especially in the fantasy genre. (from wikipedia.com)",
      industryIdentifiers: [
        { type: "ISBN_13", identifier: "9783849621698" },
        { type: "ISBN_10", identifier: "3849621693" },
      ],
      pageCount: 159,
      averageRating: 5,
      ratingsCount: 1,
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=s6gGaHHYu6gC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=s6gGaHHYu6gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "en",
    },
  },
];

export default booksMock;
