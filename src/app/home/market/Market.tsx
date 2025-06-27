"use client";

import { useState } from "react";
import styles from "./Market.module.css";
import bookPointersMock from "./bookPointersMock";

import { MapWrapper } from "../map/MapWrapper";
import { MapPopup } from "../mapPopup/MapPopup";
import MarketGrid from "../grid/GridWrapper";
import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import { MarketBookStatus } from "@/interfaces/MarketBook";

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
      <button onClick={() => setMarketView(MarketView.GRID)}>Grid</button>
      <button onClick={() => setMarketView(MarketView.MAP)}>Map</button>
      {markatView === MarketView.GRID ? (
        <MarketGrid books={data} />
      ) : (
        <MapWrapper setPreviewIndex={setPreviewIndex} />
      )}

      <MapPopup
        preview={
          previewIndex !== undefined
            ? bookPointersMock[previewIndex]
            : undefined
        }
      />
    </div>
  );
}
