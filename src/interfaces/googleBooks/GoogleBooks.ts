export interface GoogleBooksIndustryIdentifier {
  type: string;
  identifier: string;
}

export interface GoogleBooksImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

export interface GoogleBooksVolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: GoogleBooksIndustryIdentifier[];
  pageCount?: number;
  categories?: string[];
  imageLinks?: GoogleBooksImageLinks;
  language?: string;
  averageRating?: number;
  ratingsCount?: number;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBooksVolume[];
}
