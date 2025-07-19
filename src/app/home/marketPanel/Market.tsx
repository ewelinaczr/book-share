"use client";

import { useState } from "react";
import styles from "./Market.module.css";

import { MapWrapper } from "./map/MapWrapper";
import { MarketPanel } from "./browseOffersPanel/MarketPanel";
import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import MarketGrid from "./grid/MarketGrid";
import Button, { ButtonType } from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { CiSearch } from "react-icons/ci";

enum MarketView {
  GRID,
  MAP,
}

function useMarketByStatus(status?: MarketBookStatus) {
  const { data, isLoading, isError, error } = useGetAllMarketBooksQuery({
    status,
  });
  return { data, isLoading, isError, error };
}

export function Market() {
  const { data, isLoading, isError, error } = useMarketByStatus();
  const [markatView, setMarketView] = useState<MarketView>(MarketView.GRID);
  const [previewIndex, setPreviewIndex] = useState<number | undefined>(
    undefined
  );
  const [displayedBook, setDisplayedBook] = useState<MarketBook | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error loading bookshelf.
        <br />
        {JSON.stringify(error)}
      </div>
    );

  if (!data) return <div>No books maching criteria</div>;

  console.log("PRINT", data);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.layoutButtons}>
          <Button
            buttonType={
              markatView === MarketView.GRID
                ? ButtonType.PRIMARY
                : ButtonType.SECONDARY
            }
            onClick={() => setMarketView(MarketView.GRID)}
          >
            Grid
          </Button>
          <Button
            buttonType={
              markatView === MarketView.MAP
                ? ButtonType.PRIMARY
                : ButtonType.SECONDARY
            }
            onClick={() => setMarketView(MarketView.MAP)}
          >
            Map
          </Button>
        </div>
        <Input
          placeholder={"Seach for a book..."}
          width={"38rem"}
          icon={<CiSearch />}
        />
      </div>
      {markatView === MarketView.GRID ? (
        <MarketGrid
          books={data}
          selectItem={(item: MarketBook) => setDisplayedBook(item)}
          selectedItemId={displayedBook?.book._id}
        />
      ) : (
        <MapWrapper setPreviewIndex={setPreviewIndex} />
      )}
      <MarketPanel book={displayedBook} />
    </div>
  );
}
