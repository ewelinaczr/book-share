"use client";

import { useEffect, useState } from "react";
import { IPickUpSpot } from "@interfaces/PickUpSpots";
import { MapWrapper } from "../../home/marketPanel/map/MapWrapper";
import { PickUpSpotPanel } from "../pickUpSpotPanel/PickUpSpotPanel";
import { pickUpSpots } from "../../home/marketPanel/map/PickUpSpotsMock";
import styles from "./PickUpPointsMap.module.css";
import Header from "@/components/headers/Header";

function PickUpPointsMap() {
  const [displayedPickUpSpot, setDisplayedPickUpSpot] =
    useState<IPickUpSpot | null>(null);

  useEffect(() => {
    setDisplayedPickUpSpot(pickUpSpots[0]);
  }, []);

  return (
    <div className={styles.panelContainer} id="nextstep-step13">
      <Header label={"Explore Pick Up Points"} />
      <div className={styles.mapContainer}>
        <MapWrapper
          selectItem={(item: IPickUpSpot) => setDisplayedPickUpSpot(item)}
        />
        <PickUpSpotPanel spot={displayedPickUpSpot} />
      </div>
    </div>
  );
}

export default PickUpPointsMap;
