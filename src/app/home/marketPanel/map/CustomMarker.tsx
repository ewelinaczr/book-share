import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { IconType } from "react-icons";
import styles from "./CustomMarket.module.css";

interface CustomMarkerProps {
  icon: IconType;
  location: number[];
  name: string;
  color?: string;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  icon: IconComponent,
  location,
  name,
  color,
}) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  const invisibleIcon = L.divIcon({
    html: "",
    className: "invisible-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  return (
    <Marker
      position={[location[0], location[1]]}
      icon={invisibleIcon}
      ref={markerRef}
    >
      <Popup autoClose={false} closeOnClick={false} closeButton={false}>
        <div className={styles.popupContent}>
          <IconComponent className={styles.popupIcon} style={{ color }} />
          <span>{name}</span>
        </div>
      </Popup>
    </Marker>
  );
};

export default CustomMarker;
