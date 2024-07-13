import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"]   
      });

      const { Map } = await loader.importLibrary('maps');
      const { PlacesService } = await loader.importLibrary('places');

      const sydney = { lat: -33.867, lng: 151.195 };
      const map = new Map(mapRef.current as HTMLElement, {
        center: sydney,
        zoom: 15,
      });

      const service = new PlacesService(map);
      const request = {
        query: "Museum of Contemporary Art Australia",
        fields: ["name", "geometry"],
      };

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
  }, []);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

function createMarker(place: google.maps.places.PlaceResult, map: google.maps.Map) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    const infowindow = new google.maps.InfoWindow();
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

export default MapComponent;