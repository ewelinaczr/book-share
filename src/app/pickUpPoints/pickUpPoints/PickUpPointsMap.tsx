"use client";

import { useEffect, useState } from "react";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import { MapWrapper } from "../../home/marketPanel/map/MapWrapper";
import { PickUpSpotPanel } from "../pickUpSpotPanel/PickUpSpotPanel";
import { pickUpSpots } from "../../home/marketPanel/map/PickUpSpotsMock";
import styles from "./PickUpPointsMap.module.css";
import Header from "@/components/headers/Header";

function PickUpPointsMap() {
  const [displayedPickUpSpot, setDisplayedPickUpSpot] =
    useState<PickUpSpot | null>(null);

  useEffect(() => {
    setDisplayedPickUpSpot(pickUpSpots[0]);
  }, []);

  return (
    <div className={styles.panelContainer}>
      <Header label={"Explore Pick Up Points"} />
      <div className={styles.panelContainer} id="nextstep-step13">
        <MapWrapper
          selectItem={(item: PickUpSpot) => setDisplayedPickUpSpot(item)}
        />
        <PickUpSpotPanel spot={displayedPickUpSpot} />
      </div>
    </div>
  );
}

export default PickUpPointsMap;
