"use client";

import { useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { SlArrowDown } from "react-icons/sl";
import { useTranslations } from "next-intl";
import { popularBookGenres } from "./searchConfig";
import { IMarketBook } from "@interfaces/MarketBook";
import Button, { ButtonType } from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import styles from "./Search.module.css";

export interface SearchProps {
  books: IMarketBook[] | undefined;
  searchQuery: string;
  searchCategory: string;
  setSearchQuery: (q: string) => void;
  setSearchCategory: (q: string) => void;
}

export default function Search({
  books,
  searchQuery,
  searchCategory,
  setSearchQuery,
  setSearchCategory,
}: SearchProps) {
  const t = useTranslations();

  const labelToKey = useMemo(
    () => Object.fromEntries(popularBookGenres.map((g) => [g.label, g.key])),
    []
  );

  const selectedKey = labelToKey[searchCategory] ?? searchCategory;

  return (
    <div className={styles.inputContainer}>
      <Input
        id="searchInput"
        placeholder={t("market_search")}
        icon={<CiSearch />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        withoutError
      />

      <div className={styles.selectContainer}>
        <SlArrowDown className={styles.icon} />
        <select
          aria-label="Select book genre"
          value={selectedKey}
          className={styles.select}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          {popularBookGenres.map((genreObj, index) => {
            const booksByGenreCount = books?.filter((b) =>
              b.book?.volumeInfo.categories?.includes(genreObj.label)
            ).length;

            const count = index === 0 ? books?.length : booksByGenreCount;

            return (
              <option value={genreObj.key} key={genreObj.key}>
                {t(`genre_${genreObj.key}`)} ({count})
              </option>
            );
          })}
        </select>
      </div>

      <Button
        type="button"
        ariaLabel="Search clear button"
        buttonType={ButtonType.SECONDARY}
        customStyles={{ maxWidth: "10rem" }}
        onClick={() => {
          setSearchQuery("");
          setSearchCategory("allGenres");
        }}
      >
        {t("buttons_clearSearch")}
      </Button>
    </div>
  );
}
