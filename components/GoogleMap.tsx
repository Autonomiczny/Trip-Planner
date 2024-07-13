// components/GoogleMap.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

interface MyComponentProps {
  apiKey: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ apiKey }) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(center);

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const location = place.geometry?.location;
    if (location) {
      setMapCenter({ lat: location.lat(), lng: location.lng() });
      setMarkerPosition({ lat: location.lat(), lng: location.lng() });
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
      <SearchBox onPlaceSelect={handlePlaceSelect} />
    </LoadScript>
  );
};

interface SearchBoxProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onPlaceSelect }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onPlaceSelect(place);
        }
      });
    }
  }, [onPlaceSelect]);

  return <input type="text" ref={inputRef} placeholder="Search for a place" />;
};

export default React.memo(MyComponent);
