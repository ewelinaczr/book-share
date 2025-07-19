"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import bookPointersMock from "./bookPointersMock";

export function MapWrapper({ setPreviewIndex }) {
  const Map = useMemo(
    () =>
      // Load the Map component only in the browser (not during server-side rendering)
      dynamic(() => import("@/app/home/marketPanel/map/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <Map
      userPosition={[54.350009, 18.65105]}
      books={bookPointersMock}
      onSelect={setPreviewIndex}
    />
  );
}
