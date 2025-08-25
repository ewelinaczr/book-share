"use client";

import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import { MarketBook, MarketBookStatus } from "@/interfaces/MarketBook";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import { MapWrapper } from "./map/MapWrapper";
import { BookMarketPanel } from "./browseOffersPanel/BookMarketPanel";
import { PickUpSpotPanel } from "./pickUpSpotPanel/PickUpSpotPanel";
import MarketGrid from "./grid/MarketGrid";
import Button, { ButtonType } from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import styles from "./Market.module.css";

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
  const [marketView, setMarketView] = useState<MarketView>(MarketView.GRID);
  const [displayedBook, setDisplayedBook] = useState<MarketBook | null>(null);
  const [displayedPickUpSpot, setDisplayedPickUpSpot] =
    useState<PickUpSpot | null>(null);

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

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.layoutButtons}>
          <Button
            className={styles.button}
            buttonType={
              marketView === MarketView.GRID
                ? ButtonType.PRIMARY
                : ButtonType.SECONDARY
            }
            onClick={() => setMarketView(MarketView.GRID)}
          >
            Book Offers
          </Button>
          <Button
            className={styles.button}
            buttonType={
              marketView === MarketView.MAP
                ? ButtonType.PRIMARY
                : ButtonType.SECONDARY
            }
            onClick={() => setMarketView(MarketView.MAP)}
          >
            Pick up Spots
          </Button>
        </div>
        <Input
          placeholder={"Seach for a book..."}
          width={"38rem"}
          icon={<CiSearch />}
        />
      </div>
      <div className={styles.marketPanelContainer}>
        {marketView === MarketView.GRID ? (
          <MarketGrid
            books={data}
            selectItem={(item: MarketBook) => setDisplayedBook(item)}
            selectedItemId={displayedBook?.book._id}
          />
        ) : (
          <MapWrapper
            selectItem={(item: PickUpSpot) => setDisplayedPickUpSpot(item)}
          />
        )}
        {marketView === MarketView.GRID ? (
          <BookMarketPanel book={displayedBook} />
        ) : (
          <PickUpSpotPanel spot={displayedPickUpSpot} />
        )}
      </div>
    </div>
  );
}
