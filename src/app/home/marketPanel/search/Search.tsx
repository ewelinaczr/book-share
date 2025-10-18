import { CiSearch } from "react-icons/ci";
import { popularBookGenres } from "./searchConfig";
import { MarketBook } from "@/interfaces/MarketBook";
import Button, { ButtonType } from "@/components/buttons/Button";
import { SlArrowDown } from "react-icons/sl";
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
        type="button"
        ariaLabel="Search clear button"
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
      <div className={styles.selectContainer}>
        <SlArrowDown className={styles.icon} />
        <select
          aria-label="Select book genre"
          value={searchCategory}
          className={styles.select}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          {popularBookGenres.map((genre, index) => {
            const booksByGenreCount = books?.filter((b) =>
              b.book?.volumeInfo.categories?.includes(genre)
            ).length;
            return (
              <option value={genre} key={genre}>
                {genre}
                {index ? ` (${booksByGenreCount})` : ` (${books?.length})`}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  return (
    <>
      <div className={styles.inputContainer}>
        {renderSearchInput()}
        {renderGenres()}
        {renderClearButton()}
      </div>
    </>
  );
}

export default Search;
