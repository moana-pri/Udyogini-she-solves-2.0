"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }: any) {
  const [position, setPosition] = useState<any>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export function MapPicker({ onLocationSelect }: any) {
  return (
    <MapContainer
      center={[19.076, 72.8777]} // India default
      zoom={13}
      className="h-[300px] w-full rounded-lg"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
