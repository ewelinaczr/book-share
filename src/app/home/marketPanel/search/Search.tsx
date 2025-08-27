import { CiSearch } from "react-icons/ci";
import { popularBookGenres } from "./searchConfig";
import { MarketBook } from "@/interfaces/MarketBook";
import Button, { ButtonType } from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import styles from "./Search.module.css";

export interface SearchProps {
  books: MarketBook[] | undefined;
  searchQuery: string;
  searchCategory: string;
  setSearchQuery: (q: string) => void;
  setSearchCategory: (q: string) => void;
}

function Search({
  books,
  searchQuery,
  searchCategory,
  setSearchQuery,
  setSearchCategory,
}: SearchProps) {
  const renderClearButton = () => {
    return (
      <Button
        buttonType={ButtonType.SECONDARY}
        customStyles={{ maxWidth: "10rem" }}
        onClick={() => {
          setSearchQuery("");
          setSearchCategory("All Genres");
        }}
      >
        Clear Search
      </Button>
    );
  };

  const renderSearchInput = () => {
    return (
      <Input
        id="searchInput"
        placeholder="Search for a book..."
        icon={<CiSearch />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        withoutError={true}
      />
    );
  };

  const renderGenres = () => {
    return (
      <div className={styles.genresContainer}>
        {popularBookGenres.map((genre, index) => {
          const booksByGenreCount = books?.filter((b) =>
            b.book?.volumeInfo.categories?.includes(genre)
          ).length;
          return (
            <button
              key={genre}
              onClick={() => setSearchCategory(genre)}
              className={`${styles.genre} ${
                searchCategory === genre && styles.selected
              }`}
            >
              {genre}
              {index ? ` (${booksByGenreCount})` : ` (${books?.length})`}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className={styles.inputContainer}>
        {renderSearchInput()}
        {renderClearButton()}
      </div>
      {renderGenres()}
    </>
  );
}

export default Search;
