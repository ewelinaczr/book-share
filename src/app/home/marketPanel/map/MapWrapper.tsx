"use client";

import { useMemo } from "react";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import styles from "./MapWrapper.module.css";

export interface MapWrapperProps {
  selectItem: (item: PickUpSpot) => void;
}

export function MapWrapper({ selectItem }: MapWrapperProps) {
  const Map = useMemo(
    () =>
      // Load the Map component only in the browser (not during server-side rendering)
      dynamic(() => import("@/app/home/marketPanel/map/Map"), {
        loading: () => <LoadingSpinner />,
        ssr: false,
      }),
    []
  );

  return (
    <div className={styles.mapWrapper}>
      <Map userPosition={[54.350009, 18.65105]} selectItem={selectItem} />
    </div>
  );
}
