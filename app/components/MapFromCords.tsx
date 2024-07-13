"use client";
import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import type { Cords } from "./Cords";

const mapContainerStyle = {
  width: "40rem",
  height: "40rem",
};

export default function MapFromCords({ cords }: { cords: Cords }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds(cords);
      map.fitBounds(bounds);
      setMap(map);
    },
    [cords]
  );

  const onUnmount = useCallback(() => setMap(null), []);

  if (!isLoaded) {
    return <div>map is Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={cords}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={cords} label={"Label"} />
    </GoogleMap>
  );
}
