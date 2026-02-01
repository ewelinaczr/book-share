import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { PickUpSpot } from "@/interfaces/PickUpSpot";
import { pickUpSpots } from "./PickUpSpotsMock";
import CustomMarker from "./CustomMarker";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import styles from "./Map.module.css";

interface MapProps {
  userPosition: LatLngTuple;
  selectItem: (item: PickUpSpot) => void;
  zoom?: number;
}

// const userLocationPin = L.icon({
//   iconUrl: "/pin.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

function Map({ userPosition, selectItem, zoom = 14 }: MapProps) {
  const FitBoundsToMarkers = ({ positions }: { positions: LatLngTuple[] }) => {
    const map = useMap();

    useEffect(() => {
      if (positions.length > 0) {
        const bounds = new LatLngBounds(positions);
        map.fitBounds(bounds, { padding: [50, 50] }); // Optional padding
      }
    }, [map, positions]);

    return null;
  };

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

      {/* <Marker position={userPosition} icon={userLocationPin}>
        <Tooltip>Your location</Tooltip>
      </Marker> */}

      {pickUpSpots.map((spot: PickUpSpot, index) => (
        <button
          key={index}
          type="button"
          onClick={() => selectItem(spot)}
          aria-label={`Select pickup spot ${spot.name}`}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            margin: 0,
            display: "contents",
          }}
        >
          <CustomMarker
            key={index}
            icon={spot.icon}
            location={spot.location}
            name={spot.name}
            color={spot.color}
          />
        </button>
      ))}
      <FitBoundsToMarkers
        positions={pickUpSpots.map((spot) => spot.location)}
      />
    </MapContainer>
  );
}

export default Map;
