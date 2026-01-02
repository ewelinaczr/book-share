"use client";

import { useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { popularBookGenres } from "./searchConfig";
import { MarketBook } from "@/interfaces/MarketBook";
import Button, { ButtonType } from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import Dropdown from "@/components/dropdown/Dropdown";
import styles from "./Search.module.css";

export interface SearchProps {
  books: MarketBook[] | undefined;
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

  const dropdownOptions = popularBookGenres.map((genreObj, index) => {
    const booksByGenreCount = books?.filter((b) =>
      b.book?.volumeInfo.categories?.includes(genreObj.label)
    ).length;

    const count = index === 0 ? books?.length : booksByGenreCount;

    return {
      value: genreObj.key,
      label: `${t(`genre_${genreObj.key}`)} (${count})`,
    };
  });

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
      <Dropdown
        ariaLabel="Select book genre"
        value={selectedKey}
        options={dropdownOptions}
        onChange={setSearchCategory}
      />
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
