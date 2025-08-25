import {
  MapContainer,
  TileLayer,
  Circle,
  Tooltip,
  Marker,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import styles from "./Map.module.css";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PointerI } from "./MapTypes";

interface MapProps {
  userPosition: LatLngTuple;
  books: PointerI[];
  onSelect: (index: number) => void;
  zoom?: number;
}

const userLocationPin = L.icon({
  iconUrl: "/pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function Map({ userPosition, books, onSelect, zoom = 16 }: MapProps) {
  return (
    <MapContainer
      center={[userPosition[0], userPosition[1] + 0.005]}
      zoom={zoom}
      scrollWheelZoom={true}
      className={styles.map}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={userPosition} icon={userLocationPin}>
        <Tooltip>Your location</Tooltip>
      </Marker>
      {books.map(({ lat, lng, label, category }, index) => (
        <Circle
          key={index}
          center={[lat, lng]}
          radius={80}
          pathOptions={{
            weight: 1,
            color: category,
            fillColor: category,
            fillOpacity: 0.1,
          }}
          eventHandlers={{
            click: () => onSelect(index),
          }}
        >
          <Tooltip direction="right" offset={[25, 0]}>
            {label}
          </Tooltip>
        </Circle>
      ))}
    </MapContainer>
  );
}

export default Map;
