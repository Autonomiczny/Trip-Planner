"use client";
import { useEffect, useRef } from "react";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import type { Cords } from "./Cords";

const mapContainerStyle = {
  width: "40rem",
  height: "40rem",
};

declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function MapFromLocation({
  place,
  location,
}: {
  place: string;
  location: Cords;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapApiOptions: LoaderOptions = {
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    };
    const initMap = async () => {
      const libraryLoader = new Loader(mapApiOptions);
      const { Map } = await libraryLoader.importLibrary("maps");
      const { PlacesService } = await libraryLoader.importLibrary("places");
      const { AdvancedMarkerElement } = await libraryLoader.importLibrary(
        "marker"
      );

      const map = new Map(mapRef.current as HTMLElement, {
        center: location,
        zoom: 15,
        mapId: "1",
      });
      const service = new PlacesService(map);
      const request = {
        query: place,
        fields: ["name", "geometry"],
      };

      async function createMarker(
        place: google.maps.places.PlaceResult,
        map: google.maps.Map
      ) {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new AdvancedMarkerElement({
          map: map,
          position: place.geometry.location,
          title: "Uluru",
        });

        google.maps.event.addListener(marker, "click", () => {
          const infowindow = new google.maps.InfoWindow();
          infowindow.setContent(place.name || "");
          infowindow.open(map);
        });
      }

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i], map);
          }
          map.setCenter(results[0].geometry!.location!);
        }
      });
    };

    initMap();
  }, [location, place]);

  return <div ref={mapRef} style={mapContainerStyle} />;
}
