"use client";

import { useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [marketBooks, setMarketBooks] = useState<MarketBook[]>([]);

  useEffect(() => {
    if (data) {
      const filteredBooks = data.filter(
        (book: MarketBook) =>
          book.book?.volumeInfo?.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          book.book?.volumeInfo?.authors?.some((author) =>
            author.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setMarketBooks(filteredBooks);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (data) {
      setMarketBooks(data);
    }
  }, [data]);

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

  const renderMarket = () => {
    return (
      <div className={styles.marketPanelContainer}>
        {marketView === MarketView.GRID ? (
          <MarketGrid
            books={marketBooks}
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
    );
  };

  const renderSearch = () => {
    return (
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
        <div className={styles.layoutButtons}>
          <div className={styles.searchInput}>
            <Input
              placeholder="Search for a book..."
              icon={<CiSearch />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className={styles.button}
            buttonType={
              marketView === MarketView.MAP
                ? ButtonType.PRIMARY
                : ButtonType.SECONDARY
            }
            onClick={() => {
              setMarketBooks(data);
              setSearchQuery("");
            }}
          >
            Clear Search
          </Button>
        </div>
      </div>
    );
  };

  const renderEmptyMarket = () => {
    return (
      <div className={styles.emptyMarket}>
        No books found. Try to change cryteria.
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderSearch()}
      {marketBooks.length > 0 ? renderMarket() : renderEmptyMarket()}
    </div>
  );
}
